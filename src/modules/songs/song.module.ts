import { Module } from "@nestjs/common";
import { SongController } from "./song.controller";
import { SongService } from "./song.service";
import { Song } from "./entity/song.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UploadModule } from "../upload/upload.module";

@Module({
    imports: [TypeOrmModule.forFeature([Song]), UploadModule],
    controllers: [SongController],
    providers: [SongService],
    exports: [SongService]
})

export class SongModule {}