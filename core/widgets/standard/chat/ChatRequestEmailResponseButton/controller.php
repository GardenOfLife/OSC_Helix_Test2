<?php /* Originating Release: August 2018 */
  

namespace RightNow\Widgets;

class ChatRequestEmailResponseButton extends \RightNow\Libraries\Widget\Base
{
    function __construct($attrs)
    {
        parent::__construct($attrs);
    }

    function getData()
    {
        $this->data['js']['baseUrl'] = \RightNow\Utils\Url::getShortEufBaseUrl('sameAsCurrentPage');
    }
}
