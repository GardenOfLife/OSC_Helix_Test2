 /* Originating Release: August 2018 */
RightNow.Widgets.SocialUserAvatar = RightNow.Field.extend({
    overrides: {
        constructor: function() {
            this.parent();

            this.element = this.Y.one(this.baseSelector);
            this._chooseButton = this.Y.one(this.baseSelector + "_ChooseAvatar");
            if(this._chooseButton) {
                this._chooseButton.on("click", this._onButtonClick, this);
            }
            this.Y.one(this.baseSelector).delegate('click', this._onCloseClick, '.rn_CloseGallery', this);
            this.Y.one(this.baseSelector).delegate('keyup', this._updateImageForLibrary, '.rn_UserAvatar img', this);
            this.Y.one(this.baseSelector).delegate('click', this._updateImageForLibrary, '.rn_UserAvatar img', this);
            this.Y.one(this.baseSelector).delegate('click', this._onPaginatorClick, '.rn_ImagePaginator a', this);
            this.Y.one(this.baseSelector).delegate('keypress', this._onKeyPress, '.rn_UserAvatar img', this);
            if(this.avatarForm = this.element.ancestor('form')) {
                this.submitButton = this.avatarForm.one('.rn_FormSubmit button');
            }
            this.avatarSelectionType = '';
            this.currentAvatarType = '';
            if (this.data.js.socialUser) {
                this._addClickHandlers();
                this.img = this.element.one('.rn_PreviewImage img');
                this.defaultImg = this.element.one('.rn_PreviewImage .rn_Default');
                this._monitorPreviewImage(this.img);

                this._parentFormID = this.getParentFormID();
                this.parentForm().on('submit', this.onValidate, this);
                this.Y.Event.attach("click", this._onSubmitFormClick, this.submitButton, this);

                this.data.js.name = 'SocialUser.AvatarURL';
            }
            else {
                if (this.data.attrs.create_user_on_load) {
                    RightNow.Event.subscribe("evt_WidgetInstantiationComplete", function() {
                        RightNow.Event.fire("evt_userInfoRequired");
                    });
                }
                this.element.one('.rn_AddSocialUser').on('click', this._addSocialUser, this);
            }
        },

        getValue: function() {
            return this.img.hasClass('rn_Hidden') ? '' : this._getPreviewImage();
        }
    },
    
    /**
     * Event handler executed when ENTER key or SPACE key is pressed.
     */
    _onKeyPress: function(event) {
        var keyPressed = event.keyCode;

        if((keyPressed === RightNow.UI.KeyMap.ENTER) || (keyPressed === RightNow.UI.KeyMap.SPACE)) {
            this.data.js.archivedAvatar ? this._onSubmitFormClick() : this.parentForm(this._parentFormID).fire("submitRequest");
        }
    },
    
    /**
     * Event handler executed when submit button is clicked.
     */
    _onSubmitFormClick: function() {
        if(this.data.js.archivedAvatar) {
            this._displayArchivedAvatarDialog();
            return false;
        }
    },

    /*
     * Creates and displays a dialog to the user asking whether they would like
     * to resume existing session
     */
    _displayArchivedAvatarDialog: function() {
        //set up buttons and event handlers
        var buttons = [ { text: this.data.attrs.label_yes_button, handler: {fn: this._resumeSubmit, scope: this}, isDefault: true },
                        { text: this.data.attrs.label_no_button, handler: {fn: this._cancelSubmit, scope: this}, isDefault: false } ];
        var dialogBody = this.Y.Node.create(new EJS({text: this.getStatic().templates.dialogContent}).render({
            currentAvatar: this.data.js.currentAvatar,
            selectedAvatar: this.selectedAvatar,
            attrs: this.data.attrs
        }));
        this._archivedAvatarDialog = RightNow.UI.Dialog.actionDialog('', dialogBody, {"buttons": buttons, "width": "600px"});
        RightNow.UI.Dialog.addDialogEnterKeyListener(this._archivedAvatarDialog, this._resumeSubmit, this);
        this._archivedAvatarDialog.show();
        this.Y.one('#' + this._archivedAvatarDialog.id).addClass('rn_SocialUserAvatarDialog');
    },

    /**
     * Event handler executed when No button is clicked.
     */
    _cancelSubmit: function() {
        this._archivedAvatarDialog.hide();
        return false;
    },


    /**
     * Event handler executed when Yes button is clicked.
     */
    _resumeSubmit: function() {
        this._archivedAvatarDialog.hide();
        this.parentForm(this._parentFormID).fire("submitRequest");
    },


    /**
     * Event handler executed when close button is clicked.
     */
    _onCloseClick: function(e) {
        this.Y.all(this.baseSelector + " .rn_AvatarLibraryForm").addClass('rn_Hidden');
    },

    /**
     * Event handler executed when paginator is clicked.
     */
    _onPaginatorClick: function(e)
    {
        var clickedElement, firstPageNumber, lastPageNumber, firstChildVal, lastChildVal;
        var firstChild = this.Y.one(this.baseSelector + " .rn_ImagePaginator .rn_CurrentPages").one('a:first-child');
        var lastChild = this.Y.one(this.baseSelector + " .rn_ImagePaginator .rn_CurrentPages").one('a:last-child');
        firstChildVal = parseInt(firstChild.getAttribute('data-rel'), 10);
        lastChildVal = parseInt(lastChild.getAttribute('data-rel'), 10);

        if(e.target.hasClass('rn_PreviousPage')){
            clickedElement = firstChildVal - 1;
            firstPageNumber = firstChildVal - 1;
            lastPageNumber = lastChildVal - 1;
        }
        else if (e.currentTarget.hasClass('rn_NextPage')){
            clickedElement = parseInt(lastChild.getAttribute('data-rel'), 10) + 1;
            firstPageNumber = firstChildVal + 1;
            lastPageNumber = lastChildVal + 1;
        }
        else{
            clickedElement = parseInt(e.currentTarget.getAttribute('data-rel'), 10);
            firstPageNumber = firstChildVal;
            lastPageNumber = lastChildVal;
        }

        this.Y.all(this.baseSelector + " .rn_AvatarLibraryForm").setContent(this.Y.Node.create(new EJS({text: this.getStatic().templates.avatarImages}).render({
            files: this.imageFiles,
            numberOfPages: this.numberOfPages,
            firstPage: firstPageNumber,
            lastPage: lastPageNumber,
            currentPage: clickedElement,
            js: this.data.js,
            attrs: this.data.attrs
        })));

        this.firstPage = firstPageNumber;
        this.lastPage = lastPageNumber;

        this.Y.one(this.baseSelector + " .rn_ImagePaginator .rn_CurrentPages").get('children').each(function(child) {
            if(parseInt(child.getAttribute('data-rel'), 10) === clickedElement){
                 child.addClass('rn_Selected');
            }
        }, this);
    },

    /**
     * Event handler executed when form is being submitted.
     */
    onValidate: function() {
        var eo = this.createEventObject();
        eo.data.avatarSelectionType = this.avatarSelectionType;
        RightNow.Event.fire("evt_formFieldValidationPass", eo);
        return eo;
    },

    /**
     * Submits ajax request for avatar library
     * @param  {Object} e click event
     */
    _onButtonClick: function (e) {
        this.Y.all(this.baseSelector + " .rn_AvatarLibraryForm").removeClass('rn_Hidden');
        this.Y.all(this.baseSelector + " .rn_AvatarLibraryForm").setContent(this.Y.Node.create(new EJS({text: this.getStatic().templates.loadingIcon}).render()));

        var eo = new RightNow.Event.EventObject(this, {
            data: {
                w_id: this.data.info.w_id
            }
        });
        RightNow.Ajax.makeRequest(this.data.attrs.submit_avatar_library_action_ajax, eo.data, {
            data:           eo,
            json:           true,
            scope:          this,
            successHandler: this._onSubmitSuccess
        });
    },

    /**
     * Displays the images that are available in the avatar library.
     * @param response Event response
     */
    _onSubmitSuccess: function(response) {
        var bannerOptions = {},
            message;
        if(response && response.files && !response.errors) {
            this.imageFiles = response.files;
            this.numberOfPages = response.numberOfPages;
            this.Y.all(this.baseSelector + " .rn_AvatarLibraryForm").removeClass('rn_Hidden');

            this.currentPage = this.selectedPage ? this.selectedPage : 1;
            this.Y.all(this.baseSelector + " .rn_AvatarLibraryForm").setContent(this.Y.Node.create(new EJS({text: this.getStatic().templates.avatarImages}).render({
                files: this.imageFiles,
                numberOfPages: this.numberOfPages,
                firstPage: this.firstPage ? this.firstPage : 1,
                lastPage: this.lastPage || ((this.numberOfPages <= 5) ? this.numberOfPages : 5),
                currentPage: this.currentPage,
                js: this.data.js,
                attrs: this.data.attrs
            })));

            if(this.numberOfPages > 1) {
                this.paginatorElement = this.Y.one(this.baseSelector + " .rn_ImagePaginator .rn_CurrentPages");
                this.paginatorElement.get('children').each(function(child) {
                    if(this.currentPage === parseInt(child.getAttribute('data-rel'), 10)){
                         child.addClass('rn_Selected');
                    }
                }, this);

                if(this.numberOfPages > this.paginatorElement.get('children').size()){
                    this.Y.one(".rn_ImagePaginator .rn_NextPage").removeClass('rn_Hidden');
                }
            }

            if(this.selectedAvatar) {
                this.Y.one(this.baseSelector + " .rn_ProfilePictures").get('children').each(function(child) {
                    if(this.selectedAvatar === child.get('children').item(0).getAttribute('data-name')){
                        child.get('children').item(0).addClass('rn_Clicked');
                    }
                }, this);
            }
        }
        else {
            message = RightNow.Interface.getMessage("ERROR_REQUEST_ACTION_COMPLETED_MSG");
            bannerOptions.type = 'ERROR';
            RightNow.UI.displayBanner(message, bannerOptions);
        }
    },


    /**
     * Labels and class names for each status.
     * @param  {String=} status Status to retrieve; defaults
     *                          to returning all statuses
     * @return {Object}        class name and message of status
     */
    getStatus: function(status) {
        this._statuses || (this._statuses = {
            loading: {
                icon:      'rn_Loading',
                className: 'rn_LoadingStatus',
                message:   this.data.attrs.label_loading_icon_message
            },
            success: {
                icon:      'rn_CheckSquare',
                className: 'rn_Success',
                message:   this.data.attrs.label_success_icon_message
            },
            error: {
                icon:      'rn_ExclamationCircle',
                className: 'rn_Error',
                message:   this.data.attrs.label_error_icon_message
            }
        });

        return status ? this._statuses[status] : this._statuses;
    },

    /**
     * Toggles the disabled attribute on the submit form button, if available
     * @param  {boolean} state State to toggle the button's disabled attribute to
     */
    toggleSubmitButton: function(state) {
        if(!this.submitButton) return;

        this.submitButton.set('disabled', state);
    },

    /**
     * Add click handlers for avatar services
     */
    _addClickHandlers: function() {
        var services = {
            '.rn_DefaultOption': this._updateImageForDefault,
            '.rn_Service':      this._updateImageForService
        }, div;

        this.Y.Object.each(services, function(fn, id) {
            if (div = this.element.one(id)) {
                div.delegate('click', fn, 'button', this);
            }
        }, this);
    },

    /**
     * Handler for adding a social user
     */
    _addSocialUser: function(e) {
        RightNow.Event.fire("evt_userInfoRequired");
        e.halt();
    },

    /**
     * Change handler for default
     * @param  {Object} e Change event
     */
    _updateImageForDefault: function(e) {
        this.avatarSelectionType = 'default';
        this._closeAndClearSelectedAvatar();
        this._showPreviewImage(false);
        this._displayStatusForInput('loading', e.target);
        this._removeAllStatusIcons('rn_Success', 'rn_Error');
        this._replaceLoadingWithStatus('success');
        this._removeCurrent();
    },

    /**
     * Change handler for avatar library
     * @param  {Object} e Change event
     */
    _updateImageForLibrary: function(e) {
        this.currentAvatarType = 'avatar_library';
        this.Y.all(this.baseSelector + " .rn_AvatarOptions .rn_Clicked").removeClass('rn_Clicked');
        e.target.addClass('rn_Clicked');
        this.selectedAvatar = e.target.getAttribute('data-name');
        if(this.numberOfPages > 1){
            this.Y.one(this.baseSelector + " .rn_ImagePaginator .rn_CurrentPages").get('children').each(function(child) {
                if(child.hasClass('rn_Selected')){
                     this.selectedPage = parseInt(child.getAttribute('data-rel'), 10);
                }
            }, this);
        }
        this.toggleSubmitButton(true);
        this._displayStatusForInput('loading', this._chooseButton);
        this._refreshPreviewImage(this.data.attrs.avatar_library_image_location_display + e.target.getAttribute('data-name'));
    },

    /**
     * Change handler for gravatar
     * @param  {Object} e Change event
     */
    _updateImageForService: function(e) {
        this._closeAndClearSelectedAvatar();
        var serviceName = e.currentTarget.getAttribute('data-service-name');
        this.currentAvatarType = serviceName;
        this.toggleAllButtons(true);
        this._displayStatusForInput('loading', e.target);
        this._refreshPreviewImage(this._getImageUrlForService(serviceName, this.data.js.email.hash));
    },

    /**
     * Closes the avatar gallery and clears the selected image
     */
    _closeAndClearSelectedAvatar: function() {
        this.Y.all(this.baseSelector + " .rn_AvatarLibraryForm").addClass('rn_Hidden');
        this.selectedAvatar = this.selectedPage = this.firstPage = this.lastPage = null;
    },

    /**
     * Click handler for preview buttons.
     * @param  {Object} e Click event
     */
    _previewImageForSocialService: function(e) {
        this._updateImageForInput(e.target.ancestor().one('input'), true);
    },

    /**
     * Updates the preview image for the given input's value and data-service values.
     * @param  {Object} input               Y.Node input element
     * @param  {Boolean=} displayStatusIcon Whether to display a loading icon
     *                                      for the transaction
     */
    _updateImageForInput: function(input, displayStatusIcon) {
        var username = this.Y.Lang.trim(input.get('value')),
            service = input.getAttribute('data-service');

        if (!username) {
            return this._displayStatusForInput('error', input);
        }

        this.toggleSubmitButton(true);
        if (displayStatusIcon) {
            this._displayStatusForInput('loading', input);
        }

        this._refreshPreviewImage(this._getImageUrlForService(service, username));
    },

    /**
     * Inserts a loading status icon after the
     * specified element. If the element already
     * has a status element, then the status element
     * is removed.
     * @param {String} status Status to display
     * @param  {Object} forElement Y.Node
     */
    _displayStatusForInput: function(status, forElement) {
        var currentIcon = forElement.next('.rn_StatusIcon');
        if (currentIcon) {
            currentIcon.remove();
        }
        forElement.insert(this._renderStatusView(status), 'after');
    },

    /**
     * Replaces all currently-loading status icons with
     * the designated status.
     * @param  {string} status Either error or success
     */
    _replaceLoadingWithStatus: function(status) {
        this.element.all('.rn_LoadingStatus').each(function(node){
            if (node.hasClass('rn_Permanent')) {
                node.replaceClass('rn_LoadingStatus', this.getStatus(status).className);
            }
            else {
                node.replace(this.Y.Node.create(this._renderStatusView(status)));
            }
        }, this);
    },

    /**
     * Replaces all icons with the specified status.
     * @param  {string} status error or success or loading
     */
    _replaceAllWithStatus: function(status) {
        this._removeAllStatusIcons('rn_Success', 'rn_Error');
        this._replaceLoadingWithStatus(status);
    },

    /**
     * Removes all status icons or all status icons designated
     * by the specified class names
     * @param {...String} classes Status icons with the classnames to remove.
     *                            If not specified, all status icons are removed.
     *                            If a status icon has a rn_Permanent class, then the
     *                            specified classes are removed.
     */
    _removeAllStatusIcons: function() {
        var classes = arguments.length ? Array.prototype.slice.call(arguments) : ['rn_StatusIcon'],
            YArray = this.Y.Array;

        this.element.all('.' + classes.join(',.')).each(function(node) {
            if (!node.hasClass('rn_Permanent')) {
                node.remove();
            }
            else {
                YArray.each(classes, node.removeClass, node);
            }
        });
    },

    /**
     * Removes the current avatar highlighting and show both social service inputs
     */
    _removeCurrent: function() {
        this.element.all('.rn_ChosenAvatar').each(function(node) {
            RightNow.UI.hide(node.one('.rn_CurrentSocialAvatar'));
            RightNow.UI.show(node.one('.rn_NewSocialInput'));
            node.removeClass('rn_ChosenAvatar');
        });
    },

    /**
     * Renders a status icon element for the given status.
     * @param  {String} forStatus loading, success, error
     * @return {String}           Rendered view
     */
    _renderStatusView: function(forStatus) {
        this._statusView || (this._statusView = new EJS({ text: this.getStatic().templates.statusIcon }));

        return this._statusView.render(this.getStatus(forStatus));
    },

    /**
     * Sets the preview image's `src` attribute to the given url.
     * @param  {String} url image src
     */
    _refreshPreviewImage: function(url) {
        var altData = '';

        if (url === this.img.getAttribute('src')) {
            // load/error callback is expected to be async. So wait a tick.
            return this.Y.Lang.later(100, this, this._onPreviewImageLoaded, [{ target: this.img }, true]);
        }

        this.img.setAttribute('src', url);
        if (url.includes('gravatar')) {
            this.img.setAttribute('alt', this.data.js.socialUserDisplayName);
        }
        else {
            altData = url.split('/').pop().split('.')[0] || '';
            this.img.setAttribute('alt', altData);
        }
    },

    /**
     * Callback for the image's load event.
     * @param  {Object} e load event
     * @param {Boolean} displaySuccess Whether to forcefully display the success status even if
     *                                 a new image isn't copied to the `data-fallback` attribute
     */
    _onPreviewImageLoaded: function(e, displaySuccess) {
        this.toggleAllButtons(false);
        if (this._copyElementAttribute(e.target, 'src', 'data-fallback') || displaySuccess) {
            this._replaceAllWithStatus('success');
            this._showPreviewImage(true);
            this._removeCurrent();
            this.avatarSelectionType = this.currentAvatarType;
        }
    },

    /**
     * Callback for the image's error event.
     * Sets the `src` attribute back to the last successfully-loaded
     * url set in the `data-fallback` attribute.
     * @param  {Object} e error event
     */
    _onPreviewImageError: function(e) {
        this.toggleAllButtons(false);
        this._copyElementAttribute(e.target, 'data-fallback', 'src');
        this._replaceLoadingWithStatus('error');

        if (!this.img.getAttribute('data-fallback')) {
            this._showPreviewImage(false);
        }
    },

    /**
     * Sets up event listeners on the image.
     * @param  {Object} img Y.Node image
     */
    _monitorPreviewImage: function(img) {
        this._copyElementAttribute(img, 'src', 'data-fallback');

        img.on('load', this._onPreviewImageLoaded, this);
        img.on('error',this._onPreviewImageError, this);
    },

    /**
     * Toggle the default and preview images
     * @param {Boolean} turnOn Whether to turn on or off the preview image
     */
    _showPreviewImage: function(turnOn) {
        if (turnOn) {
            RightNow.UI.show(this.img);
            RightNow.UI.hide(this.defaultImg);
        }
        else {
            RightNow.UI.hide(this.img);
            RightNow.UI.show(this.defaultImg);
        }
    },

    /**
     * Copies an attribute value from one attribute to another.
     * @param  {Object} el  Y.Node
     * @param  {String} from From attribute
     * @param  {String} to   To attribute
     * @return {Boolean} False if the values are already the same
     *                         and a copy didn't happen
     */
    _copyElementAttribute: function(el, from, to) {
        var fromValue = el.getAttribute(from),
            toValue = el.getAttribute(to);

        if (fromValue === toValue) return false;

        return !!el.setAttribute(to, fromValue);
    },

    /**
     * Returns the preview image's `src` attribute.
     * @return {String} src
     */
    _getPreviewImage: function() {
        // Does a fresh node query to avoid caching on `this.img`.
        return this.element.one('.rn_PreviewImage img').get('src');
    },

    /**
     * Retrieves the image url for the specified service.
     * @param  {String} service  One of the supported services
     * @param  {String} username The user-entered username
     * @return {String}          Url
     */
    _getImageUrlForService: function(service, username) {
        return this.data.js[service].url;
    },
    /**
     * Toggles the disabled attribute on the all button in the page
     * @param  {boolean} state State to toggle the buttons are disabled attribute to
     */
    toggleAllButtons : function(state) {
        if(!this.avatarForm) return;

        this.avatarForm.all('button').each(function(node) {
            node.set('disabled', state);
        }, this);
    }
});
