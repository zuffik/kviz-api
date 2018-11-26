import { sign } from 'jsonwebtoken';
import * as _ from 'lodash';
import { Request, Response } from "express";
import { Storage } from "../storage/Storage";
import * as password_hash from 'password_hash';
import { UniqueId, User } from "../index";

export const blacklist: string[] = [];

const createJWT = (details: {
    maxAge?: number;
    sessionData?: any;
}) => {
    details.maxAge = details.maxAge || parseInt(process.env.JWT_TIMEOUT || '', 10) || 3600;
    details.sessionData = _.reduce(details.sessionData || {}, (prev, val, key) => {
        if (typeof val !== "function" && key !== "password") {
            prev[key] = val;
        }
        return prev;
    }, {} as { [key: string]: string });
    return sign({
        data: details.sessionData
    }, process.env.JWT_SECRET || '', {
        expiresIn: details.maxAge,
        algorithm: 'HS256'
    });
};

export const userLogin = async (req: any, res: Response) => {
    const user: User<UniqueId> | undefined = await (await Storage.instance()).getUserByName(req.body.name);
    if (!user) {
        return res.status(404).json({
            errorCode: 404,
            error: 'not_found'
        });
    }
    if (!password_hash(req.body.password).verify(user.password)) {
        return res.status(401).json({
            errorCode: 401,
            error: 'passwords_mismatch'
        });
    }

    const token = createJWT({sessionData: user});
    res.setHeader('Authorization', `Bearer ${token}`);
    res.json({token});
};

export const userLogout = (req: Request, res: any) => {
    blacklist.push(req.header('Authorization') || '');
    res.status(202).send();
};
