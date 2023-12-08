
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import { GraphQLDateTime, GraphQLObjectID, GraphQLLatitude, GraphQLLongitude, GraphQLURL } from 'graphql-scalars'

export interface CreatePingInput {
    userID: ObjectID;
    title: string;
    picks: string[];
    longitude: Longitude;
    latitude: Latitude;
    description?: Nullable<string>;
    url?: Nullable<URL>;
    radius?: Nullable<number>;
}

export interface UPingInput {
    title?: Nullable<string>;
    picks?: Nullable<string[]>;
    longitude?: Nullable<Longitude>;
    latitude?: Nullable<Latitude>;
    description?: Nullable<string>;
    url?: Nullable<URL>;
    radius?: Nullable<number>;
    media?: Nullable<Nullable<MediaInput>[]>;
}

export interface MediaInput {
    key: string;
    type: string;
}

export interface Media {
    key: string;
    type: string;
}

export interface Ping {
    id: ObjectID;
    title: string;
    userID: string;
    user?: Nullable<User>;
    longitude: Longitude;
    latitude: Latitude;
    picks: string[];
    description?: Nullable<string>;
    url?: Nullable<URL>;
    radius?: Nullable<number>;
    createdAt?: Nullable<DateTime>;
    media?: Nullable<Nullable<Media>[]>;
}

export interface IQuery {
    getPing(id: ObjectID): Ping | Promise<Ping>;
}

export interface User {
    id: ObjectID;
    pings?: Nullable<Nullable<Ping>[]>;
}

export interface IMutation {
    createPing(payload: CreatePingInput): Ping | Promise<Ping>;
    updatePing(id: ObjectID, payload: UPingInput): ObjectID | Promise<ObjectID>;
}

export type Longitude = typeof GraphQLLongitude;
export type Latitude = typeof GraphQLLatitude;
export type URL = typeof GraphQLURL;
export type DateTime = typeof GraphQLDateTime;
export type ObjectID = unknown;
type Nullable<T> = T | null;
