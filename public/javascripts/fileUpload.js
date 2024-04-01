FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  );

  FilePond.setOptions({
    stylePanelAspectRatio	: 150/100,
    imageResizeTargetWidth: 150,
    imageResizeTargetHeight: 150

  })

  FilePond.parse(document.body)
