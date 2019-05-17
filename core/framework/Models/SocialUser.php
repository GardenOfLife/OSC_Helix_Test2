<?php /* Originating Release: August 2018 */

namespace RightNow\Models;

use RightNow\Utils\Text,
    RightNow\Utils\Config,
    RightNow\Utils\Framework,
    RightNow\Utils\Validation,
    RightNow\Utils\Connect as ConnectUtil,
    RightNow\Libraries\ConnectTabular,
    RightNow\Utils\Url,
    RightNow\Connect\v1_3 as Connect;

/**
 * Performs operations with the SocialUser Connect object.
 */
class SocialUser extends SocialObjectBase {
    /**
     * Returns an empty SocialUser object.
     *
     * @return Connect\SocialUser SocialUser
     */
    public function getBlank() {
        $blankUser = parent::getBlank();
        \RightNow\Libraries\Decorator::add($blankUser, array('class' => 'Permission/SocialUserPermissions', 'property' => 'SocialPermissions'));
        return $this->getResponseObject($blankUser);
    }

    /**
     * Returns a Connect SocialUser for the given id.
     *
     * @param  int $id SocialUser id. If unspecified and user is logged in,
     * the logged-in user's record is returned
     * @return Connect\SocialUser|null SocialUser or null if there are error messages and the user wasn't retrieved
     */
    public function get($id = null) {
        if($id === null){
            if(Framework::isSocialUser()){
                $id = $this->CI->session->getProfileData('socialUserID');
            }
            else{
                return $this->getResponseObject(null, null, Config::getMessage(SOCIAL_SPECIFIED_SOCIAL_LOGGED_IN_MSG));
            }
        }
        $user = parent::get($id);
        if(!is_object($user)){
            return $this->getResponseObject(null, null, $user ?: sprintf(Config::getMessage(SOCIAL_USER_WITH_ID_S_DOES_NOT_EXIST_LBL), $id));
        }

        \RightNow\Libraries\Decorator::add($user, array('class' => 'Permission/SocialUserPermissions', 'property' => 'SocialPermissions'));

        if (!$user->SocialPermissions->canRead()) {
            return $this->getResponseObject(null, null, Config::getMessage(DOES_HAVE_READ_PERMISSI_SOCIAL_USER_LBL));
        }
        return $this->getResponseObject($user);
    }

    /**
     * Gets the SocialUser attached to the specified Contact.
     * @param  int $contactID Contact id
     * @return Connect\SocialUser|null SocialUser or null if there are error messages and the user wasn't retrieved
     */
    public function getForContact($contactID) {
        if (!Framework::isValidID($contactID)) {
            return $this->getResponseObject(null, null, "Invalid ID: $contactID");
        }
        // get the contact, then attempt to fetch the SocialUser (will be null if nonexistent)
        try {
            if ($contact = Connect\Contact::fetch($contactID)) {
                $user = $contact->SocialUser;
            }
        }
        catch (\Exception $e) {
            return $this->getResponseObject(null, null, $e->getMessage());
        }

        return $this->getResponseObject($user, null, ($user) ? null : sprintf(Config::getMessage(SOCIAL_USER_NOT_FOUND_CONTACT_ID_S_LBL), $contactID));
    }

    /**
     * Creates a SocialUser.
     *
     * @param  array $formData Form data to create the SocialUser with
     * @param  Boolean $updateSession Whether to update the logged-in session profile
     * @return Connect\SocialUser|null Created Social or null if there are error messages and
     *              the user wasn't created
     */
    public function create(array $formData, $updateSession = false) {
        if ($formData['Socialuser.Contact']->value && $this->getForContact($formData['Socialuser.Contact']->value)->result) {
            return $this->getResponseObject(null, null, Config::getMessage(THERE_SOCIAL_ALREADY_TH_CONTACT_LBL));
        }

        if ($formData['Socialuser.DisplayName']->value) {
            // create a blank social user and attach to the contact; DisplayName is required
            $newSocialUser = $this->getBlank()->result;

            $errors = $warnings = array();
            $this->assignFormFieldValues($newSocialUser, $formData, $errors, $warnings, false, array('SocialUser.id'));
            if ($errors) {
                return $this->getResponseObject(null, null, $errors);
            }

            if (!$newSocialUser->SocialPermissions->canCreate()) {
                return $this->getResponseObject(null, null, Config::getMessage(DOES_HAVE_PERMISSION_CREATE_SOCIAL_USER_LBL));
            }

            return $this->createOrUpdateUser($newSocialUser, __FUNCTION__, $updateSession, $warnings);
        }
    }

    /**
     * Updates a SocialUser.
     *
     * @param  int     $id            ID of the SocialUser to update
     * @param  array   $formData      Form data to update the SocialUser with
     * @param  Boolean $updateSession Whether to update the logged-in session profile
     * @param  Boolean $isOpenLogin   Whether the caller is OpenLogin
     * @return Connect\SocialUser|null Updated SocialUser or null if there are error
     *                                                   messages and the user wasn't update
     */
    public function update($id, array $formData, $updateSession = false, $isOpenLogin = false) {
        if(!$isOpenLogin) {
            $socialUserResponseObject = $this->getSocialUser();
            if($socialUserResponseObject->errors) {
                return $socialUserResponseObject;
            }
        }

        $user = $this->get($id);
        if (!$user->result) {
            return $user;
        }

        $errors = $warnings = array();
        // Skip checking permissions when the update request comes from OpenLogin
        $this->assignFormFieldValues($user->result, $formData, $errors, $warnings, !$isOpenLogin);
        if ($errors) {
            return $this->getResponseObject(null, null, $errors);
        }

        return ($user->result) ? $this->createOrUpdateUser($user->result, __FUNCTION__, $updateSession, $warnings) : $user;
    }

    /**
     * Updates moderator action on the user
     * @param int $userID ID of the user to update
     * @param array $data Action data to update the user with
     * @return RightNow\Libraries\ResponseObject Connect\SocialUser on success else error response object
     */
    public function updateModeratorAction($userID, array $data) {
        return $this->update($userID, $data);
    }

    /**
     * Performs the create or update on the user.
     *
     * @param  Connect\SocialUser      $user      SocialUser
     * @param  string                  $operation Either 'create' or 'update'
     * @param  Boolean $updateSession Whether to update the logged-in session profile
     * @param  array $warnings Any warnings accumulated by the calling code
     * @return Connect\SocialUser|null Updated user or null if there was an error
     */
    protected function createOrUpdateUser(Connect\SocialUser $user, $operation, $updateSession, array $warnings) {
        $operation = "{$operation}Object";
        $source = ($operation === 'create') ? SRC2_EU_NEW_CONTACT : SRC2_EU_CONTACT_EDIT;

        try {
            $user = parent::$operation($user, $source);
        }
        catch (\Exception $e) {
            $user = $e->getMessage();
        }
        if (!is_object($user)) {
            return $this->getResponseObject(null, null, $user);
        }

        if ($updateSession) {
            $this->CI->session->writePersistentProfileData('socialUserID', $user->ID);
        }

        return $this->getResponseObject($user, 'is_object', null, $warnings);
    }

    /**
     * Processes form fields and assigns values on the SocialUser.
     *
     * @param Connect\SocialUser $user             SocialUser
     * @param array              $fields           Form fields
     * @param array              &$errors          Populated with error messages
     * @param array              &$warnings        Populated with warning messages
     * @param boolean            $checkPermissions If true and an update is present, check user has permission to perform the update.
     * @param array              $fieldsToIgnore   A list of field names to ignore.
     */
    protected function assignFormFieldValues(Connect\SocialUser $user, array $fields, array &$errors, array &$warnings, $checkPermissions = true, array $fieldsToIgnore = array('SocialUser.id', 'SocialUser.contact')) {
        foreach ($fields as $name => $field) {
            if (!Text::beginsWithCaseInsensitive($name, 'socialuser') || in_array($name, $fieldsToIgnore)) {
                continue;
            }

            $fieldComponents = explode('.', $name);
            try {
                list($currentValue, $metaData) = ConnectUtil::getObjectField($fieldComponents, $user);
            }
            catch (\Exception $e) {
                $warnings []= $e->getMessage();
                continue;
            }

            if ($currentValue !== $field->value) {
                if ($checkPermissions && !\RightNow\Utils\Permissions\Social::userCanEdit(implode('.', array_slice($fieldComponents, 1)), $user->ID, $field->value, $errors)) {
                    continue;
                }

                // make sure displayname has any special chars html encoded
                if (Text::stringContainsCaseInsensitive($name, 'displayname')) {
                    $field->value = htmlspecialchars($field->value);
                }

                if (Validation::validate($field, $name, $metaData, $errors)) {
                    $field->value = ConnectUtil::castValue($field->value, $metaData);
                    if ($error = parent::setFieldValue($user, $name, $field->value)) {
                        $errors []= $error;
                    }
                    if($name === 'SocialUser.AvatarURL') {
                        $this->validateUserAvatarUrl($user, $field, $errors, $currentValue);
                    }
                }
            }
        }
    }
    
    /**
     * Validate user avatar url
     * @param Connect\SocialUser $user SocialUser
     * @param type $field              Form field
     * @param type &$errors            Populated with error message
     * @param type $currentValue       Current field value
     * @return boolean
     */
    protected function validateUserAvatarUrl(Connect\SocialUser $user, $field, &$errors, $currentValue) {
        $error = false;
        switch ($field->avatarSelectionType) {
            case 'gravatar':
                $contact = $this->CI->model('Contact')->getForSocialUser($user->ID)->result;
                $url = $this->getGravatarUrl($contact->Emails[0]->Address);
                if($url !== $field->value) {
                    $error = true;
                }
                break;
            case 'avatar_library':
                if(Url::isExternalUrl($field->value)) {
                    $error = true;
                }
                break;
            case 'default':
                if($field->value) {
                    $error = true;
                }
                break;
            case '':
                if($currentValue !== $field->value) {
                    $error = true;
                }
                break;
            default:
                $error = true;
        }
        if($error) {
            $errors[] = \RightNow\Utils\Config::getMessage(NOT_A_VALID_PROFILE_PICTURE_MSG);
            return false;
        }
        return true;
    }
    
    /**
     * Framing gravatar avatar url
     * @param type $emailId User Email
     * @return type string
     */
    public function getGravatarUrl($emailId){
        $gravatarUrl = sprintf('https://www.gravatar.com/avatar/%s?d=404&s=256', md5(strtolower(trim($emailId))));
        return $gravatarUrl;
    }
}
