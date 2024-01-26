class Download {
  public downloadByCreateElementA(fileStream: any, fileName?: string) {
    const url = window.URL.createObjectURL(new Blob([fileStream]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      //临时处理下，后端后面解决filename中有 “” 的问题
      fileName ? fileName.replace(/"/g, '') : 'file'
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public downloadBlobFile(blob: Blob, fileName?: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName ? fileName : 'file');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default new Download();
