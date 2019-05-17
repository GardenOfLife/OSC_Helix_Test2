<?php /* Originating Release: August 2018 */

namespace RightNow\Widgets;

use RightNow\Utils\Framework;

class RecentlyAskedQuestions extends \RightNow\Libraries\Widget\Base {
    function __construct($attrs) {
        parent::__construct($attrs);
    }

    function getData() {
        $filters = $this->getFilters();
        $questionList = $this->CI->model('SocialQuestion')->getRecentlyAskedQuestions($filters)->result;

        $this->data['js']['questions'] = array();
        foreach ($questionList as $question) {
            if (!array_key_exists($question->ID, $this->data['js']['questions'])) {
                $this->data['js']['questions'][$question->ID] = $question;
            }
        }
    }

    protected function getFilters() {
        $filters = array(
            'maxQuestions'    => $this->data['attrs']['maximum_questions'],
            'includeChildren' => $this->data['attrs']['include_children'],
            'answerType'      => array()
        );
        if ($this->data['attrs']['category_filter']) {
            $filters['category'] = $this->data['attrs']['category_filter'];
        }
        if ($this->data['attrs']['product_filter']) {
            $filters['product'] = $this->data['attrs']['product_filter'];
        }
        return $filters;
    }
}
