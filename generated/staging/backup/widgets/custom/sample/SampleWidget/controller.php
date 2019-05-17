<?php  if (!defined('BASEPATH')) exit('No direct script access allowed');

class SampleWidget extends Widget 
{
    function SampleWidget()
    {
        parent::Widget();
        
        //Create attributes here
        $this->attrs['attribute'] = new Attribute(msg_get_rnw(ATTRIBUTE_NAME_LBL), 'String', msg_get_rnw(ATTRIBUTE_DESCRIPTION_LBL), msg_get_rnw(ATTRIBUTE_DEFAULT_VALUE_LBL));
    }
    
    function generateWidgetInformation()
    {
        //Create information to display in the tag gallery here
	    $this->info['notes'] =  msg_get_rnw(WIDGET_SERVES_TEMPL_MODEL_OWN_CUST_MSG);
        $this->parms['url_parameter'] = new UrlParam(msg_get_rnw(URL_PARAMETER_LBL), 'parm', true, msg_get_rnw(DEF_URL_PARAMETERS_AFFECT_WIDGET_LBL), 'parm/3');
    }
    
    function getData($data)
    {
        //Perform php logic here   
        return $data;
    }    
}   
 


