export class Image {
  _id: string;
  desc: string;
  uploadedAt: Date;
  name: string;
  img: { data: string, contentType: string };
  user: { id: string };
}
