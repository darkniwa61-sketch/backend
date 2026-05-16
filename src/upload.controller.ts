import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY!
);

@Controller('api/upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(), // Keep in memory, upload to Supabase
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new HttpException('Only image files (jpg, png, webp) are allowed!', HttpStatus.BAD_REQUEST), false);
      }
      cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Generate unique filename
    const randomName = Array(32).fill(null)
      .map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    const filename = `${randomName}${extname(file.originalname)}`;

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('uploads')
      .upload(filename, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new HttpException(`Upload failed: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Return permanent public URL
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(filename);

    return { url: data.publicUrl };
  }
}
