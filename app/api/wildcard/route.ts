import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Wildcard from '@/models/Wildcard';
import { protect } from '@/lib/auth';

export async function GET() {
  await connectToDatabase();
  try {
    let wildcard = await Wildcard.findOne({});
    if (!wildcard) {
      // Return a default structure if none exists in the DB yet,
      // but do not save it to DB yet.
      wildcard = {
        isActive: false,
        title: 'Beatbox Championship Wildcard Submission',
        description: 'Submit your wildcard entries for the upcoming Hyderabad Beatbox Championship! Read the guidelines below and fill out the submission form.',
        poster: '',
        googleFormUrl: 'https://docs.google.com/forms/',
      };
    }
    return NextResponse.json(wildcard);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await connectToDatabase();
  try {
    await protect(req);
    const body = await req.json();
    
    let wildcard = await Wildcard.findOne({});
    if (wildcard) {
      wildcard.isActive = body.isActive;
      wildcard.title = body.title;
      wildcard.description = body.description;
      wildcard.poster = body.poster;
      wildcard.googleFormUrl = body.googleFormUrl;
      await wildcard.save();
    } else {
      wildcard = await Wildcard.create(body);
    }
    
    return NextResponse.json(wildcard, { status: 200 });
  } catch (error: any) {
    if (error.message.includes('Not authorized')) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
