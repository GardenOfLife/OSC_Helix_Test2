<?php /* Originating Release: August 2018 */?>
<div id="rn_<?= $this->instanceID ?>" class="<?= $this->classList ?>">
    <rn:block id="top"/>
    <?= $this->render('Select', array('type' => 'column')) ?>
    <?= $this->render('Select', array('type' => 'direction')) ?>
    <rn:block id="bottom"/>
</div>
