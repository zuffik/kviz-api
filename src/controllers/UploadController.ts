import { Storage } from "../storage/Storage";
import * as fs from 'fs';
import * as path from "path";
import * as readChunk from 'read-chunk';
import * as fileType from 'file-type';

export const uploadFiles = async (req: any, res: any) => {
    res.json({
        files: await Promise.all(req.files.map(async (f: Express.Multer.File) =>
            await (await Storage.instance()).saveFile(f)))
    });
};

export const serveFile = async (req: any, res: any) => {
    const file = path.join(__dirname, `/../../../upload/${req.params.file}`);
    try {
        if (fs.existsSync(file)) {
            const buffer = readChunk.sync(file, 0, 8);
            const m = fileType(buffer) || {mime: 'text/plain'};
            res.setHeader('Content-Type', m.mime);
            return res.sendFile(file);
        } else {
            res.status(404);
            res.json({
                error: 'not_found'
            });
        }
    } catch (e) {
        res.status(500);
        res.json({
            error: 'srv_err'
        });
    }
};
