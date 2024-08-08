import { NextRequest, NextResponse } from 'next/server';
import { initSocket } from '@/socket';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function GET(req: NextRequest, res: NextResponse) {
    if(!res.socket.server.io) {

    }
}