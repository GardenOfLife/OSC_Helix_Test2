<div class="rn_<?= ucfirst($channel) ?>Link rn_30margintop">
    <a href="<?= $channelData['url'] ?>"><span aria-label="<?= $channelData['label'] ?>"><?= $channelData['label'] ?></span></a>
    <? if ($channelData['description']): ?>
        <div class="rn_<?= ucfirst($channel) ?>Description">
            <span aria-label="<?= $channelData['description'] ?>"><?= $channelData['description'] ?></span>
        </div>
    <? endif ?>
</div>