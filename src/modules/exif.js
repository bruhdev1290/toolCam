import piexif from 'piexifjs';

export function embedNoteInExif(dataUrl, note) {
  try {
    let exifObj;
    try {
      exifObj = piexif.load(dataUrl);
    } catch (e) {
      exifObj = { '0th': {}, 'Exif': {}, 'GPS': {}, '1st': {}, 'thumbnail': null };
    }

    // Write note into ImageDescription and UserComment
    exifObj['0th'][piexif.ImageIFD.ImageDescription] = note;

    // UserComment needs special encoding
    const userComment = 'ASCII\0\0\0' + note;
    exifObj['Exif'][piexif.ExifIFD.UserComment] = userComment;

    // Set DateTimeOriginal
    const now = new Date();
    const dateStr = now.getFullYear() + ':' +
      String(now.getMonth() + 1).padStart(2, '0') + ':' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');
    exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] = dateStr;
    exifObj['0th'][piexif.ImageIFD.DateTime] = dateStr;

    // Software tag
    exifObj['0th'][piexif.ImageIFD.Software] = 'LinusCam PWA';

    const exifBytes = piexif.dump(exifObj);
    return piexif.insert(exifBytes, dataUrl);
  } catch (err) {
    console.error('EXIF write error:', err);
    return dataUrl;
  }
}

export function readExif(dataUrl) {
  try {
    const exifObj = piexif.load(dataUrl);

    const desc = exifObj['0th'][piexif.ImageIFD.ImageDescription] || '';

    // Parse UserComment (strip ASCII prefix)
    const rawComment = exifObj['Exif'][piexif.ExifIFD.UserComment];
    let comment = '';
    if (rawComment && typeof rawComment === 'string') {
      comment = rawComment.startsWith('ASCII\0\0\0')
        ? rawComment.substring(8)
        : rawComment;
    }

    const dateOrig = exifObj['Exif'][piexif.ExifIFD.DateTimeOriginal] ||
                     exifObj['0th'][piexif.ImageIFD.DateTime] || '';

    const software = exifObj['0th'][piexif.ImageIFD.Software] || '';

    const make = exifObj['0th'][piexif.ImageIFD.Make] || '';
    const model = exifObj['0th'][piexif.ImageIFD.Model] || '';
    const camera = [make, model].filter(Boolean).join(' ');

    const pixelW = exifObj['Exif'][piexif.ExifIFD.PixelXDimension];
    const pixelH = exifObj['Exif'][piexif.ExifIFD.PixelYDimension];
    const resolution = (pixelW && pixelH) ? `${pixelW} \u00d7 ${pixelH}` : '';

    return { desc, comment, dateOrig, software, camera, resolution };
  } catch (err) {
    console.error('EXIF read error:', err);
    return null;
  }
}
