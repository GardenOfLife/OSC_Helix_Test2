<?php
namespace Custom\Models;

class EventsModel extends \RightNow\Models\Base
{
    function __construct()
    {
        parent::__construct();
    }

    function setContactCustomField()
    {
        // Need to set the custom field
        /**
         * This function can be executed a few different ways depending on where it's being called:
         *
         * From a widget or another model: $this->CI->model('custom/Sample')->sampleFunction();
         *
         * From a custom controller: $this->model('custom/Sample')->sampleFunction();
         * 
         * Everywhere else: $CI = get_instance();
         *                  $CI->model('custom/Sample')->sampleFunction();
         */
    }
    function setContactParticipateEvent($eventId, $status, $specialInstructions, $partySize) {
        // $status is yes/no/maybe

        // return "true" / "false" depending on if it went through successfully
    }
}
