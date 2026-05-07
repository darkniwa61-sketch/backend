import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

@Controller('api/upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      // Generate unique filename
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 10000)}.${fileExt}`;
      
      // Upload to Supabase 'uploads' bucket
      const { data, error } = await supabase
        .storage
        .from('uploads')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      // Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('uploads')
        .getPublicUrl(fileName);

      return {
        url: publicUrlData.publicUrl
      };
    } catch (error) {
      console.error('Upload failed:', error);
      throw new HttpException('Upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
