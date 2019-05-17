RightNow.namespace('Custom.Widgets.input.CustomTextInput');
Custom.Widgets.input.CustomTextInput = RightNow.Widgets.TextInput.extend({ 
    /**
     * Place all properties that intend to
     * override those of the same name in
     * the parent inside `overrides`.
     */
    overrides: {
        /**
         * Overrides RightNow.Widgets.TextInput#constructor.
         */
        constructor: function() {
            // Call into parent's constructor
            this.parent();
			this.data.attrs.require_validation = false;
			document.getElementsByClassName("rn_TextInputValidate")[0].style.display ="none";
			RightNow.Event.subscribe("ValidationChange", this.ValidationChange, this);
        }
	


        /**
         * Overridable methods from TextInput:
         *
         * Call `this.parent()` inside of function bodies
         * (with expected parameters) to call the parent
         * method being overridden.
         */
        // swapLabel: function(container, requiredness, label, template)
        // setLabel: function(newLabel)
        // reload: function(content, readOnly)
        // _subscribeToFormValidation: function()
        // constraintChange: function(evt, constraint)
        // getVerificationValue: function()
        // onValidate: function(type, args)
        // _displayError: function(errors, errorLocation)
        // toggleErrorIndicator: function(showOrHide, fieldToHighlight, labelToHighlight)
        // _toggleFormSubmittingFlag: function(event)
        // _blurValidate: function(event, validateVerifyField)
        // _validateVerifyField: function(errors)
        // _checkExistingAccount: function()
        // _massageValueForModificationCheck: function(value)
        // _onAccountExistsResponse: function(response, originalEventObject)
        // onProvinceChange: function(type, args)
        // _initializeMask: function()
        // _createMaskArray: function(mask)
        // _getSimpleMaskString: function()
        // _compareInputToMask: function(submitting)
        // _showMaskMessage: function(error)
        // _setMaskMessage: function(message)
        // _showMask: function()
        // _hideMaskMessage: function()
        // _onValidateFailure: function()
    },
		ValidationChange: function(evt, constraint) {
				
	//	this.parent(evt, constraint);
	//	constraint = constraint[0];
		categorySelected =this.parentForm().findField("Incident.Category");
       //  if(constraint.required === this.data.attrs.require_validation) return;
	    EmailValidationMapping = categorySelected.data.js.EmailValidationMapping
	   value = categorySelected._eo.data.hierChain[0];
	   if (EmailValidationMapping[value] && 
	   this.Y.Array.indexOf(EmailValidationMapping[value], this._fieldName) !== -1) {
		this.data.attrs.require_validation = true;
		document.getElementsByClassName("rn_TextInputValidate")[0].style.display ="";
	   } else {
		   this.data.attrs.require_validation = false;
		document.getElementsByClassName("rn_TextInputValidate")[0].style.display = "none";
		}
	}

    /**
     * Sample widget method.
     */
});