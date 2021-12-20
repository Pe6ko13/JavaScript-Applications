import { getUserData } from '../util.js';
import * as api from './api.js';

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

// Team requests:

export async function getTeams() {
    const teams = await api.get('/data/teams');
    const members = await getMembers(teams.map(t => t._id));
    teams.forEach(t => t.memberCount = members.filter(m => m.teamId == t._id).length);
    return teams;
}

export async function getMyTeams() {
    const user = getUserData();
    const userId = user.userId;
    const [ teamsCreated, teamMember ] = await Promise.all([
        api.get(`/data/teams?where=_ownerId%3D%22${userId}%22`),
        api.get(`/data/members?where=_ownerId%3D%22${userId}%22%20AND%20status%3D%22member%22&load=team%3DteamId%3Ateams`)
    ]);
    

    const teams = teamsCreated.concat(teamMember.map(r => r.team));
    const members = await getMembers(teams.map(t => t._id));
    teams.forEach(t => t.memberCount = members.filter(m => m.teamId == t._id).length);
    return teams;
}

export async function getTeamById(id) {
    return await api.get('/data/teams/' + id);
}

export async function createTeam(team) {
    return await api.post('/data/teams', team );
}

export async function editTeam(id, team) {
    return await api.edit('/data/teams/' + id, team);
}

export async function deleteTeam(id) {
    return await api.del('/data/teams/' + id);
}

export async function requestToJoinTeam(teamId) {
    const body = { teamId };
    return await api.post('/data/members', body);
}

// Members requests: 

export async function getReqByTeamId(teamId) {
    return await api.get(`/data/members?where=teamId%3D%22${teamId}%22&load=user%3D_ownerId%3Ausers`);
}

export async function getMembers(teamIds) {
    const query = encodeURIComponent(`teamId IN ("${teamIds.join('", "')}") AND status="member"`);
    return await api.get(`/data/members?where=${query}`);
}

export async function cancelMembership(requestId) {
    return await api.del('/data/members/' + requestId);
}

export async function approveMembership(request) {
    const body = {
        teamId: request.teamId,
        status: 'member'
    };
    return await api.edit('/data/members/' + request._id, body);
}