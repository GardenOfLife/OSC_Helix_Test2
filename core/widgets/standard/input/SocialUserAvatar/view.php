<?php /* Originating Release: August 2018 */?>
<div id="rn_<?= $this->instanceID ?>" class="<?= $this->classList ?>">
    <rn:block id="top"/>

    <? if ($this->data['js']['editingOwnAvatar']): ?>
        <h2><?= $this->data['attrs']['label_update_picture'] ?></h2>
    <? endif ?>

    <? if ($this->data['js']['socialUser']): ?>
        <rn:block id="prePreviewImage"/>
        <section class="rn_PreviewImage">
            <div class="rn_UserAvatar">
                <div class="rn_Avatar rn_Large rn_Placeholder">
                    <span class="rn_Default rn_DefaultColor<?= $this->data['js']['defaultAvatar']['color'] ?> <?= !$this->data['currentAvatar']['url'] ? '' : 'rn_Hidden'?>">
                        <span class="rn_Liner">
                            <?= $this->data['js']['defaultAvatar']['text'] ?>
                        </span>
                    </span>
                    <img class="<?= $this->data['currentAvatar']['url'] ? '' : 'rn_Hidden'?>" src="<?= $this->data['currentAvatar']['url'] ?: '#' ?>" alt=""/>
                </div>
            </div>
            <div><a href="<?= $_SERVER['REQUEST_URI'] ?>" class="rn_Refresh" title="<?= $this->data['attrs']['label_reset_avatar_tooltip']; ?>"><?= $this->data['attrs']['label_reset_avatar'] ?></a></div>
        </section>
        <rn:block id="postPreviewImage"/>

        <rn:block id="preAvatarOptions"/>
        <section class="rn_AvatarOptions">
            <? foreach($this->data['attrs']['avatar_selection_options'] as $avatarOptionName): ?>
                <?= $this->render($avatarOptionName); ?>
            <? endforeach; ?>
        </section>
        <rn:block id="postAvatarOptions"/>
    <? else: ?>
        <div class="rn_NoSocialUser">
            <?= $this->data['attrs']['label_no_public_profile'] ?>
            <a href="javascript:void(0);" id="rn_<?= $this->instanceID ?>_AddSocialUser" class="rn_AddSocialUser"><?= $this->data['attrs']['label_add_public_profile'] ?></a>
        </div>
    <? endif; ?>
    <rn:block id="bottom"/>
</div>
