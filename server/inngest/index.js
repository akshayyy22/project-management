import { Inngest } from "inngest";
import prisma from "../config/prisma";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

// Inngest function to sync user creation:
const syncuserCreation = inngest.createFunction(
    { id: "sync-user-creation" },
    {event: 'clerk/user.created'},
    async ({ event }) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
    }
)

// Inngest function to delete user from database:
const syncUserDeletion = inngest.createFunction(
    { id: "sync-user-with-clerk" },
    {event: 'clerk/user.deleted'},
    async ({ event }) => {
        const { data } = event;
        await prisma.user.create({
            data: {
                id: data.id,
                email: data.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
    }
)

// Inngest function to update user in database:
const syncUserUpdate = inngest.createFunction(
    { id: "update-user-with-clerk" },
    {event: 'clerk/user.updated'},
    async ({ event }) => {
        const { data } = event;
        await prisma.user.update({
            data: {
                id: data.id,
                email: data.email_addresses[0]?.email_address,
                name: data?.first_name + " " + data?.last_name,
                image: data?.image_url,
            }
        });
    }
)


// Add the function to the exported array:
export const functions = [
    syncuserCreation,   // Sync user creation
    syncUserDeletion,   // Sync user deletion
    syncUserUpdate,     // Sync user update
];