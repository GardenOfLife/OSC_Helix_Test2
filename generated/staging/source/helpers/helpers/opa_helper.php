<?php

function getOPAURL($profile, $url_attr, $policy_model_attr, $locale_attr, $init_id_attr)
{
    /**
     * This helper can be loaded a few different ways depending on where it's being called:
     *
     * From a widget or model: $this->CI->load->helper('opa')
     *
     * From a custom controller: $this->load->helper('opa')
     *
     * Once loaded you can call this function by simply using getOPAURL()
     */

    // SET THIS TO THE VALUE OBTAINED FROM OPA-HUB -> DATA SERVICE
    $shared_secret = '';

    if ($profile != null)
    {
        $contactID = $profile->c_id->value;

        if ($contactID > 0 && $shared_secret != '')
        {
            $ts = round(microtime(true) * 1000);
            $plaintext = $contactID . ';' . $ts . ';';
            $token = sha1($plaintext . $shared_secret);
            $security_params = '?user=' . $plaintext . $token;
        }
    }

    if ($policy_model_attr != '')
    {
        $policy_model = '/' . $policy_model_attr;

        // locale only applicable if policy model is specified
        if ($locale_attr != '')
        {
            $locale = '/' . $locale_attr;
        }
    }

    if ($init_id_attr != '' && $security_params != '')
    {
        $initID = '&initID=' . $init_id_attr;
    }

    $url = $url_attr . '/startsession' . $policy_model . $locale . $security_params . $initID;

    return $url;
}
