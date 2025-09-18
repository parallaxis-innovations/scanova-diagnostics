import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { directusService } from "@/lib/directus";

interface CustomSession {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  access_token?: string;
}

// GET - Fetch family members for current user
export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.access_token as string;
    const userId = session.user.id as string;

    const familyMembers = await directusService.getFamilyMembers(userId, accessToken);

    return NextResponse.json({
      data: familyMembers.data || [],
      message: "Family members retrieved successfully"
    });

  } catch (error) {
    console.error("Error fetching family members:", error);
    return NextResponse.json(
      { error: "Failed to fetch family members", details: error },
      { status: 500 }
    );
  }
}

// POST - Create new family member
export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.access_token as string;
    const currentUserId = session.user.id as string;
    
    const body = await req.json();
    
    // Validate required fields
    if (!body.full_name || !body.email_id) {
      return NextResponse.json(
        { error: "Full name and email are required" },
        { status: 400 }
      );
    }

    // Prepare family member data
    const familyData = {
      full_name: body.full_name,
      phone_number: body.phone_number || "",
      email_id: body.email_id,
      address: body.address || "",
      age: body.age ? Number(body.age) : undefined,
      gender: body.gender || "",
      blood_group: body.blood_group || "",
    };

    const result = await directusService.createFamilyMember(
      currentUserId,
      familyData,
      accessToken
    );

    return NextResponse.json({
      data: result,
      message: "Family member created successfully",
      defaultPassword: result.defaultPassword,
    });

  } catch (error: any) {
    console.error("Error creating family member:", error);
    
    // Handle specific Directus errors
    if (error.message?.includes('duplicate') || error.message?.includes('already exists')) {
      return NextResponse.json(
        { error: "A family member with this email already exists" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create family member", details: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Update family member
export async function PATCH(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.access_token as string;
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: "Family member personal_information ID is required" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      full_name: body.full_name,
      phone_number: body.phone_number,
      email_id: body.email_id,
      address: body.address,
      age: body.age ? Number(body.age) : undefined,
      gender: body.gender,
      blood_group: body.blood_group,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof typeof updateData] === undefined) {
        delete updateData[key as keyof typeof updateData];
      }
    });

    const result = await directusService.updateFamilyMember(
      body.id, // This should be the personal_information record ID
      updateData,
      accessToken
    );

    return NextResponse.json({
      data: result,
      message: "Family member updated successfully"
    });

  } catch (error: any) {
    console.error("Error updating family member:", error);
    return NextResponse.json(
      { error: "Failed to update family member", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove family member
export async function DELETE(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as CustomSession;
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accessToken = session.access_token as string;
    const currentUserId = session.user.id as string;
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json(
        { error: "Family member personal_information ID is required" },
        { status: 400 }
      );
    }

    const result = await directusService.deleteFamilyMember(
      body.id, // personal_information record ID
      currentUserId, // current user's ID to update the relation
      accessToken
    );

    return NextResponse.json({
      data: result,
      message: "Family member removed successfully"
    });

  } catch (error: any) {
    console.error("Error deleting family member:", error);
    return NextResponse.json(
      { error: "Failed to remove family member", details: error.message },
      { status: 500 }
    );
  }
}