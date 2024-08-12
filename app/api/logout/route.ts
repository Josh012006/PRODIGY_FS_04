import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    try {
        
        const response = NextResponse.json({ message: "User logged out successfully" }, { status: 200 });

        response.cookies.delete("echoToken");

        return response;

    } catch (error) {
        console.log("An error occurred in logout route ", error);
        return NextResponse.json({ message: "An error occurred in logout route" }, { status: 500 });
    }
}