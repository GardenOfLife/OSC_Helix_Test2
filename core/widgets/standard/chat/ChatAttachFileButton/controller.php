<?php /* Originating Release: August 2018 */

namespace RightNow\Widgets;

class ChatAttachFileButton extends FileAttachmentUpload
{
    function __construct($attrs)
    {
        parent::__construct($attrs);
    }

    function getData()
    {
        parent::getData();

        $this->data['js']['name'] = null;
        $this->classList->add('rn_Hidden');
    }
}
