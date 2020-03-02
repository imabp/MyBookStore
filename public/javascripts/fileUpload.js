console.log("Filepond Connection successful")
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
);
FilePond.setOptions({
    stylePanelAspectRatio:150/100,
    ImageResizeTargetHeight:150,
    ImageResizeTargetWidth:100,
})


FilePond.parse(document.body);