import { getXataClient } from "$xata";
import type { Adapter, DatabaseSession, DatabaseUser, UserId } from "lucia";

export class XataAdapter implements Adapter {
    async getSessionAndUser(
        sessionId: string
    ): Promise<[session: DatabaseSession | null, user: DatabaseUser | null]> {
        const row = await getXataClient()
            .db.Sessions.select(["id", "expiresAt", "user.*"])
            .filter({ id: sessionId })
            .getFirst();

        if (!row) return [null, null];
        return [
            {
                id: row.id,
                userId: row.user!.id,
                expiresAt: row.expiresAt,
                attributes: {},
            },
            row.user
                ? {
                      id: row.user.id,
                      attributes: {
                          name: row.user.name ?? "--",
                          email: row.user.email ?? "--",
                          avatar: row.user.avatar ?? "--",
                          isGov: row.user.isGov,
                      },
                  }
                : null,
        ];
    }

    async getUserSessions(userId: UserId) {
        const rows = await getXataClient()
            .db.Sessions.select(["id", "expiresAt", "user.id"])
            .filter({ "user.id": userId })
            .getAll();

        return rows.map((row) => ({
            id: row.id,
            userId: row.user!.id,
            expiresAt: row.expiresAt,
            attributes: {},
        }));
    }

    async setSession(session: DatabaseSession) {
        await getXataClient().db.Sessions.create({
            id: session.id,
            user: session.userId,
            expiresAt: session.expiresAt,
        });
    }

    async updateSessionExpiration(sessionId: string, expiresAt: Date) {
        await getXataClient().db.Sessions.update({ id: sessionId, expiresAt });
    }

    async deleteSession(sessionId: string) {
        await getXataClient().db.Sessions.delete({ id: sessionId });
    }

    async deleteUserSessions(userId: UserId) {
        const sessions = await getXataClient()
            .db.Sessions.select(["id"])
            .filter({ "user.id": userId })
            .getAll();
        await Promise.allSettled(sessions.map((s) => s.delete()));
    }

    async deleteExpiredSessions() {
        const sessions = await getXataClient()
            .db.Sessions.select(["id"])
            .filter({ expiresAt: { $lt: new Date() } })
            .getAll();
        await Promise.allSettled(sessions.map((s) => s.delete()));
    }
}
