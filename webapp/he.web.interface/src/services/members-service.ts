import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase-config';

export interface MemberHP {
  userId: string;
  memberDocId?: string; // Document ID in members_hp collection
  tenantKey: string;
  role: string;
  active: boolean;
  email?: string; // Store email for pending invites
  firstName?: string;
  lastName?: string;
  invitedAt?: any;
  activatedAt?: any;
}

// Get all members for a tenant
export async function getTenantMembers(tenantKey: string): Promise<MemberHP[]> {
  try {
    const membersRef = collection(db, 'members_hp');
    const q = query(membersRef, where('tenantKey', '==', tenantKey));
    const querySnapshot = await getDocs(q);

    const members: MemberHP[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as MemberHP;
      members.push({
        ...data,
        memberDocId: doc.id, // Store document ID (userId_tenantKey) for matching with AssignedToUserKey
        userId: data.userId // Use userId from document data
      });
    });

    return members;
  } catch (error) {
    console.error('Error getting tenant members:', error);
    return [];
  }
}

// Get current user's member record for a specific tenant
export async function getCurrentUserMember(userId: string, tenantKey: string): Promise<MemberHP | null> {
  try {
    const membersRef = collection(db, 'members_hp');
    const q = query(
      membersRef,
      where('userId', '==', userId),
      where('tenantKey', '==', tenantKey),
      where('active', '==', true)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as MemberHP;
    }

    return null;
  } catch (error) {
    console.error('Error getting current user member:', error);
    return null;
  }
}

// Get all tenants for a user (by email or userId)
export async function getUserTenants(email: string): Promise<MemberHP[]> {
  try {
    const membersRef = collection(db, 'members_hp');
    const q = query(membersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    const tenants: MemberHP[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as MemberHP;
      tenants.push({
        ...data,
        memberDocId: doc.id // Store document ID for reference
      });
    });

    return tenants;
  } catch (error) {
    console.error('Error getting user tenants:', error);
    return [];
  }
}

// Get all active tenants for a user (by userId and email)
export async function getUserActiveTenants(userId: string, email?: string): Promise<MemberHP[]> {
  try {
    const membersRef = collection(db, 'members_hp');

    // First try to find by userId
    const qUserId = query(
      membersRef,
      where('userId', '==', userId),
      where('active', '==', true)
    );
    const userIdSnapshot = await getDocs(qUserId);

    const tenants: MemberHP[] = [];
    userIdSnapshot.forEach((doc) => {
      const data = doc.data() as MemberHP;
      tenants.push({
        ...data,
        memberDocId: doc.id // Store document ID for reference
      });
    });

    // If no results and email provided, also check by email (for newly activated accounts)
    if (tenants.length === 0 && email) {
      const qEmail = query(
        membersRef,
        where('email', '==', email),
        where('active', '==', true)
      );
      const emailSnapshot = await getDocs(qEmail);

      emailSnapshot.forEach((doc) => {
        const data = doc.data() as MemberHP;
        tenants.push({
          ...data,
          memberDocId: doc.id // Store document ID for reference
        });
      });
    }

    return tenants;
  } catch (error) {
    console.error('Error getting user active tenants:', error);
    return [];
  }
}

// Check if user is a member of a tenant
export async function isMemberOfTenant(email: string, tenantKey: string): Promise<boolean> {
  try {
    const membersRef = collection(db, 'members_hp');
    const q = query(
      membersRef,
      where('email', '==', email),
      where('tenantKey', '==', tenantKey)
    );
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking tenant membership:', error);
    return false;
  }
}

// Invite a member (creates pending member record)
export async function inviteMember(
  email: string,
  tenantKey: string,
  role: string,
  firstName?: string,
  lastName?: string
): Promise<void> {
  try {
    // Check if already invited
    const existing = await isMemberOfTenant(email, tenantKey);
    if (existing) {
      throw new Error('User is already a member or has been invited');
    }

    // For pending invites (no userId yet), create a temporary ID using email_tenantKey
    // This will be migrated to userId-based doc when user activates
    const tempMemberId = `pending_${email}_${tenantKey}`.replace(/[^a-zA-Z0-9_]/g, '_');
    const memberRef = doc(db, 'members_hp', tempMemberId);

    await setDoc(memberRef, {
      userId: '', // Will be filled when user signs up
      email,
      tenantKey,
      role,
      active: false,
      firstName: firstName || '',
      lastName: lastName || '',
      invitedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error inviting member:', error);
    throw error;
  }
}

// Activate member when they create an account or if they already have one
export async function activateMember(
  email: string,
  userId: string,
  tenantKey: string,
  firstName?: string,
  lastName?: string
): Promise<void> {
  try {
    // Find the pending invite document
    const membersRef = collection(db, 'members_hp');
    const q = query(
      membersRef,
      where('email', '==', email),
      where('tenantKey', '==', tenantKey),
      where('active', '==', false)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Member invitation not found');
    }

    // Get the pending invite data
    const pendingDoc = querySnapshot.docs[0];
    const pendingData = pendingDoc.data() as MemberHP;

    // Create a new document with userId_tenantKey as the document ID
    const memberId = `${userId}_${tenantKey}`;
    const newMemberRef = doc(db, 'members_hp', memberId);

    await setDoc(newMemberRef, {
      userId,
      email,
      tenantKey,
      role: pendingData.role,
      active: true,
      firstName: firstName !== undefined ? firstName : (pendingData.firstName || ''),
      lastName: lastName !== undefined ? lastName : (pendingData.lastName || ''),
      invitedAt: pendingData.invitedAt,
      activatedAt: serverTimestamp(),
    });

    // Delete the old pending document
    await deleteDoc(pendingDoc.ref);

    console.log(`Activated member: ${email} with userId: ${userId} for tenant: ${tenantKey}`);
  } catch (error) {
    console.error('Error activating member:', error);
    throw error;
  }
}

// Get pending invitations for an email
export async function getPendingInvitations(email: string): Promise<MemberHP[]> {
  try {
    const membersRef = collection(db, 'members_hp');
    const q = query(
      membersRef,
      where('email', '==', email),
      where('active', '==', false)
    );
    const querySnapshot = await getDocs(q);

    const invitations: MemberHP[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as MemberHP;
      invitations.push({
        ...data,
        memberDocId: doc.id // Store document ID for reference (pending_email_tenantKey format)
      });
    });

    return invitations;
  } catch (error) {
    console.error('Error getting pending invitations:', error);
    return [];
  }
}

// Add a member directly (when user already has account)
export async function addExistingUserAsMember(
  email: string,
  userId: string,
  tenantKey: string,
  role: string,
  firstName?: string,
  lastName?: string
): Promise<void> {
  try {
    // Check if already a member
    const existing = await isMemberOfTenant(email, tenantKey);
    if (existing) {
      throw new Error('User is already a member');
    }

    // Use userId_tenantKey as the document ID
    const memberId = `${userId}_${tenantKey}`;
    const memberRef = doc(db, 'members_hp', memberId);

    await setDoc(memberRef, {
      userId,
      email,
      tenantKey,
      role,
      active: true,
      firstName: firstName || '',
      lastName: lastName || '',
      invitedAt: serverTimestamp(),
      activatedAt: serverTimestamp(),
    });

    console.log(`Added existing user as member: ${email} with userId: ${userId} for tenant: ${tenantKey}`);
  } catch (error) {
    console.error('Error adding existing user as member:', error);
    throw error;
  }
}

// Update member names from Firebase Auth user profile
export async function updateMemberNamesFromAuthProfile(
  email: string,
  userId: string,
  tenantKey: string,
  displayName?: string
): Promise<void> {
  try {
    // Use userId_tenantKey as the document ID
    const memberId = `${userId}_${tenantKey}`;
    const memberRef = doc(db, 'members_hp', memberId);

    const memberDoc = await getDoc(memberRef);
    if (!memberDoc.exists()) {
      console.log('Member document not found, skipping name update');
      return;
    }

    const memberData = memberDoc.data() as MemberHP;

    // Only update if names are missing and displayName is available
    const hasFirstName = memberData.firstName && memberData.firstName.trim();
    const hasLastName = memberData.lastName && memberData.lastName.trim();

    if ((!hasFirstName || !hasLastName) && displayName) {
      const nameParts = displayName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updateData: any = {};
      if (!hasFirstName && firstName) {
        updateData.firstName = firstName;
      }
      if (!hasLastName && lastName) {
        updateData.lastName = lastName;
      }

      if (Object.keys(updateData).length > 0) {
        await updateDoc(memberRef, updateData);
        console.log('Updated member names from auth profile:', updateData);
      }
    }
  } catch (error) {
    console.error('Error updating member names from auth profile:', error);
    // Don't throw - this is a non-critical operation
  }
}

// Delete a member by document ID
export async function deleteMemberByDocId(
  memberDocId: string
): Promise<void> {
  try {
    const memberRef = doc(db, 'members_hp', memberDocId);

    await deleteDoc(memberRef);
    console.log(`Deleted member document: ${memberDocId}`);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}

// Delete a member from a tenant
export async function deleteMember(
  userId: string,
  tenantKey: string
): Promise<void> {
  try {
    const memberId = `${userId}_${tenantKey}`;
    const memberRef = doc(db, 'members_hp', memberId);

    await deleteDoc(memberRef);
    console.log(`Deleted member: ${userId} from tenant: ${tenantKey}`);
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
}

// Update member role using document ID
export async function updateMemberRoleByDocId(
  memberDocId: string,
  newRole: string
): Promise<void> {
  try {
    const memberRef = doc(db, 'members_hp', memberDocId);

    await updateDoc(memberRef, {
      role: newRole,
    });
    console.log(`Updated role for member document ${memberDocId} to ${newRole}`);
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
}

// Update member role
export async function updateMemberRole(
  userId: string,
  tenantKey: string,
  newRole: string
): Promise<void> {
  try {
    const memberId = `${userId}_${tenantKey}`;
    const memberRef = doc(db, 'members_hp', memberId);

    await updateDoc(memberRef, {
      role: newRole,
    });
    console.log(`Updated role for member: ${userId} in tenant: ${tenantKey} to ${newRole}`);
  } catch (error) {
    console.error('Error updating member role:', error);
    throw error;
  }
}

// Update member name (firstName and lastName) for all tenants where user is a member
export async function updateMemberNames(
  userId: string,
  email: string,
  firstName: string,
  lastName: string
): Promise<void> {
  try {
    // Get all tenants for this user
    const membersRef = collection(db, 'members_hp');

    // Query by userId
    const qUserId = query(
      membersRef,
      where('userId', '==', userId)
    );
    const userIdSnapshot = await getDocs(qUserId);

    // Query by email as fallback
    const qEmail = query(
      membersRef,
      where('email', '==', email)
    );
    const emailSnapshot = await getDocs(qEmail);

    // Collect all unique member documents
    const memberDocs = new Map();

    userIdSnapshot.forEach((doc) => {
      memberDocs.set(doc.id, doc);
    });

    emailSnapshot.forEach((doc) => {
      memberDocs.set(doc.id, doc);
    });

    // Update each member document
    const updatePromises = Array.from(memberDocs.values()).map(async (doc) => {
      const memberRef = doc.ref;
      await updateDoc(memberRef, {
        firstName: firstName || '',
        lastName: lastName || '',
      });
    });

    await Promise.all(updatePromises);
    console.log(`Updated names for ${memberDocs.size} member record(s)`);
  } catch (error) {
    console.error('Error updating member names:', error);
    throw error;
  }
}
