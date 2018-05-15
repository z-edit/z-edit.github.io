ngapp.service('errorResolutionFactory', function() {
    // PRIVATE
    var ignoreResolution = {
        label: 'Ignore',
        class: 'neutral',
        description: 'This resolution will leave the error in the plugin.'
    };

    var removeRecordResolution = {
        label: 'Delete',
        class: 'negative',
        description: 'This resolution will remove the record from the plugin.'
    };

    var tweakEdidResolution = {
        label: 'Tweak EDID',
        class: 'positive',
        availability: 'When the record has an Editor ID.',
        description: 'This resolution will adjusted the EditorID of the record so it is no longer an ITM.'
    };

    var tweakPositionResolution = {
        label: 'Tweak Position',
        class: 'positive',
        availability: 'When the record is a placed object.',
        description: 'This resolution will slightly adjust the position of the reference so it is no longer an ITM.'
    };

    var nullifyResolution = {
        label: 'Nullify',
        class: 'positive',
        availability: 'When the element allows NULL references.',
        description: 'This resolution will set the reference to a NULL [00000000] reference.'
    };

    var removeResolution = {
        label: 'Remove',
        class: 'negative',
        description: 'This resolution will remove the error element from the record.'
    };

    var repairResolution = {
        label: 'Repair',
        class: 'positive',
        description: 'This resolution will fix the order of subrecords in the record and trim invalid ones.'
    };

    var replaceNavmeshResolution = {
        label: 'Replace Navmesh',
        class: 'positive',
        availability: 'When the record is a navmesh and a replacement navmesh is present.',
        description: 'This resolution will replace the deleted navmesh with the new navmesh introduced by the plugin.'
    };

    var buryNavmeshResolution = {
        label: 'Bury Navmesh',
        class: 'positive',
        availability: 'When the record is a navmesh.',
        description: 'This resolution will lower the navmesh\'s verticies below the ground and remove its edge links.'
    };

    var undeleteAndDisableResolution = {
        label: 'Undelete and Disable',
        class: 'positive',
        availability: 'When the record is a placed object.',
        description: 'This resolution will undelete the reference and mark it as disabled.'
    };

    var clearSubrecordsResolution = {
        label: 'Clear Subrecords',
        color: 'positive',
        availability: 'When the record is not a placed object or a navmesh.',
        description: 'This resolution will clear the record\'s subrecords.'
    };

    var restoreResolution = {
        label: 'Restore',
        class: 'negative',
        description: 'This resolution will restore the record.  You should not use this resolution unless you know exactly what you\'re doing!'
    };

    var identicalResolutions = [removeRecordResolution, tweakEdidResolution,
        tweakPositionResolution, ignoreResolution];

    // PUBLIC
    this.errorResolutions = {
        ITM: identicalResolutions,
        ITPO: identicalResolutions,
        DR: [replaceNavmeshResolution, buryNavmeshResolution,
            undeleteAndDisableResolution, clearSubrecordsResolution,
            restoreResolution, ignoreResolution],
        UES: [repairResolution, removeRecordResolution, ignoreResolution],
        URR: [nullifyResolution, removeResolution, ignoreResolution],
        UER: [nullifyResolution, removeResolution, ignoreResolution],
        OE: [ignoreResolution]
    };

    this.ignoreResolution = ignoreResolution;
});
