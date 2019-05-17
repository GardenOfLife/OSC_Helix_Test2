<?php /* Originating Release: August 2018 */

namespace RightNow\Widgets;

class SocialUserAvatar extends \RightNow\Libraries\Widget\Base {
    function __construct($attrs) {
        parent::__construct($attrs);
        $this->setAjaxHandlers(array(
            'submit_avatar_library_action_ajax' => array(
                'method' => 'getImages',
                'clickstream' => 'submit_avatar_library_action_ajax'
            )
        ));
    }

    function getData() {
        if (!\RightNow\Utils\Framework::isLoggedIn()) return false;

        $services = array('gravatar', 'assets');
        $this->data['js']['editingOwnAvatar'] = true;

        if (array_search('default', $this->data['attrs']['avatar_selection_options']) === false) {
            $this->data['attrs']['avatar_selection_options'][] = 'default';
        }

        if(!is_readable(HTMLROOT . $this->data['attrs']['avatar_library_image_location_gallery'])) {
            $this->data['attrs']['avatar_selection_options'] = array_diff($this->data['attrs']['avatar_selection_options'], array('avatarLibrary'));
        }

        $socialUser = $this->CI->model('SocialUser')->get()->result;
        if (($userID = \RightNow\Utils\Url::getParameter('user')) && $userID != $socialUser->ID &&
            ($socialUserFromURL = $this->CI->model('SocialUser')->get($userID)->result) &&
            $socialUserFromURL->SocialPermissions->canUpdateAvatar()) {
            $socialUser = $socialUserFromURL;
            $this->data['js']['editingOwnAvatar'] = false;
            $services = array();
        }

        $this->data['js']['socialUser'] = $socialUser ? $socialUser->ID : null;
        $this->data['js']['socialUserDisplayName'] = $socialUser ? $socialUser->DisplayName : '';
        $this->data['js']['defaultAvatar'] = $this->helper('Social')->getDefaultAvatar($socialUser->DisplayName);

        $currentAvatar = explode($this->data['attrs']['avatar_library_image_location_display'], $socialUser->AvatarURL);
        $this->data['js']['archivedAvatar'] = !(is_readable(HTMLROOT . $this->data['attrs']['avatar_library_image_location_gallery'] . $currentAvatar[1]));
        $this->data['js']['currentAvatar'] = $currentAvatar[1];

        $contact = $this->CI->model('Contact')->getForSocialUser($socialUser->ID)->result;
        $this->data['js']['gravatar']['url'] = $this->CI->model('SocialUser')->getGravatarUrl($contact->Emails[0]->Address);
        $this->data['js']['email'] = array(
            'address' => $contact->Emails[0]->Address,
            'hash' => md5($contact->Emails[0]->Address),
        );

        $this->data['currentAvatar'] = array(
            'url' => $socialUser->AvatarURL,
        );

        // default type to other
        $this->data['currentAvatar']['type'] = 'other';
        foreach ($services as $service) {
            if (\RightNow\Utils\Text::stringContainsCaseInsensitive($socialUser->AvatarURL, $service)) {
                $this->data['currentAvatar']['type'] = $service;
                break;
            }
        }
    }

    /**
     * Handles the AJAX request for retrieving images.
     */
    function getImages() {
        $avatarImages = $this->getFiles(HTMLROOT . $this->data['attrs']['avatar_library_image_location_gallery'], $this->data['attrs']['avatar_library_count']);

        $outcome = json_encode(array(
            'numberOfPages' => (int) ceil(count($avatarImages) / $this->data['attrs']['avatar_library_page_size']),
            'files' => $avatarImages
        ));
        $this->echoJSON($outcome);
    }

    /**
     * Determines the names of the files to be displayed.
     * @param string $imagesDirectory The directory of the images to be displayed.
     * @param int $maxNumberOfImages The maximum number of images to be displayed
     * @return array The array of images to be displayed.
     */
    function getFiles($imagesDirectory, $maxNumberOfImages) {
        $files = array();
        $extensions = array_map('trim', array_unique(explode(',', strtolower($this->data['attrs']['avatar_library_image_types']))));
        if ($handle = opendir($imagesDirectory . 'everyone/')) {
            while (false !== ($file = readdir($handle))) {
                $fileExtension = strtolower($this->getFileExtension($file));
                $sizeInKB = filesize($imagesDirectory . 'everyone/' . $file) / 1024;

                if ($fileExtension && in_array($fileExtension, $extensions) && $sizeInKB <= $this->data['attrs']['avatar_library_max_image_size']) {
                     $files[] = 'everyone/' . $file;
                }
                if (count($files) === $maxNumberOfImages)
                    break;
            }
            closedir($handle);
        }
        return $files;
    }

    /**
     * Returns a file's extension.
     * @param string $fileName Name of the file
     * @return string The extension string
     */
    function getFileExtension($fileName) {
        return substr(strrchr($fileName, '.'), 1);
    }

}