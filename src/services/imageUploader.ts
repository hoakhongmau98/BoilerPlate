import axios from 'axios';
import FormData from 'form-data';
import Settings from '@configs/settings';

class ImageUploaderService {
  public static async singleUpload (file: any) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    const result = await axios.post(Settings.imageUploaderEndpoint, formData, {
      headers: {
        ...formData.getHeaders(),
      },
    });
    return result.data.data.url.src;
  }
}

export default ImageUploaderService;
