import conf from '../conf/conf.js';
import { Client, TablesDB, Storage, Query, ID, Permission, Role } from 'appwrite';

let postsRequest = null;

export class Service {
    client = new Client();
    tablesDB;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);
        this.tablesDB = new TablesDB(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({ title, slug, content, featuredImage, status, userId, category }) {
        try {
            return await this.tablesDB.createRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug,
                data: { title, content, featuredImage, status, userId, category }
            });
        } catch (error) {
            if (error.type !== 'row_invalid_structure') {
                console.error('Could not create post:', error);
                return false;
            }

            try {
                return await this.tablesDB.createRow({
                    databaseId: conf.appwriteDatabaseId,
                    tableId: conf.appwriteCollectionId,
                    rowId: slug,
                    data: { title, content, featuredImage, status, userId },
                });
            } catch (fallbackError) {
                console.error('Could not create post without category:', fallbackError);
                return false;
            }
        }
    }


    async updatePost(slug, { title, content, featuredImage, status, category }) {
        try {
            return await this.tablesDB.updateRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug,
                data: { title, content, featuredImage, status, category }
            });
        } catch (error) {
            if (error.type !== 'row_invalid_structure') {
                console.error('Could not update post:', error);
                return false;
            }

            try {
                return await this.tablesDB.updateRow({
                    databaseId: conf.appwriteDatabaseId,
                    tableId: conf.appwriteCollectionId,
                    rowId: slug,
                    data: { title, content, featuredImage, status },
                });
            } catch (fallbackError) {
                console.error('Could not update post without category:', fallbackError);
                return false;
            }
        }
    }

    async deletePost(slug) {
        try {
            await this.tablesDB.deleteRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug
            });
            return true;
        } catch (error) {
            console.log(`Error in deletePost: ${error}`);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.tablesDB.getRow({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                rowId: slug
            });
        } catch (error) {
            console.log(`Error in getPost: ${error}`);
            return false;
        }
    }

    async getPosts() {
        if (!postsRequest) {
            postsRequest = this.tablesDB.listRows({
                databaseId: conf.appwriteDatabaseId,
                tableId: conf.appwriteCollectionId,
                queries: [Query.equal('status', "active")]
            }).finally(() => {
                postsRequest = null;
            });
        }

        return postsRequest;
    }

    async getComments(postId) {
        if (!conf.appwriteCommentsTableId || conf.appwriteCommentsTableId === 'undefined') {
            throw new Error('Comments table is not configured.');
        }

        return this.tablesDB.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCommentsTableId,
            queries: [Query.equal('postId', postId)],
        });
    }

    async createComment({ postId, userId, userName, content }) {
        if (!conf.appwriteCommentsTableId || conf.appwriteCommentsTableId === 'undefined') {
            throw new Error('Comments table is not configured.');
        }

        return this.tablesDB.createRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCommentsTableId,
            rowId: ID.unique(),
            data: { postId, userId, userName, content },
            permissions: [
                Permission.read(Role.any()),
                Permission.delete(Role.user(userId)),
            ],
        });
    }

    async deleteComment(commentId) {
        if (!conf.appwriteCommentsTableId || conf.appwriteCommentsTableId === 'undefined') {
            throw new Error('Comments table is not configured.');
        }

        return this.tablesDB.deleteRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteCommentsTableId,
            rowId: commentId,
        });
    }

    async getPostLikes(postId) {
        if (!conf.appwriteLikesTableId || conf.appwriteLikesTableId === 'undefined') {
            throw new Error('Likes table is not configured.');
        }

        return this.tablesDB.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteLikesTableId,
            queries: [Query.equal('postId', postId), Query.limit(1)],
        });
    }

    async getUserLike(postId, userId) {
        if (!conf.appwriteLikesTableId || conf.appwriteLikesTableId === 'undefined') {
            throw new Error('Likes table is not configured.');
        }

        const response = await this.tablesDB.listRows({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteLikesTableId,
            queries: [
                Query.equal('postId', postId),
                Query.equal('userId', userId),
                Query.limit(1),
            ],
        });

        return response.rows[0] || null;
    }

    async createLike({ postId, userId }) {
        if (!conf.appwriteLikesTableId || conf.appwriteLikesTableId === 'undefined') {
            throw new Error('Likes table is not configured.');
        }

        return this.tablesDB.createRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteLikesTableId,
            rowId: ID.unique(),
            data: { postId, userId },
            permissions: [
                Permission.read(Role.any()),
                Permission.delete(Role.user(userId)),
            ],
        });
    }

    async deleteLike(likeId) {
        if (!conf.appwriteLikesTableId || conf.appwriteLikesTableId === 'undefined') {
            throw new Error('Likes table is not configured.');
        }

        return this.tablesDB.deleteRow({
            databaseId: conf.appwriteDatabaseId,
            tableId: conf.appwriteLikesTableId,
            rowId: likeId,
        });
    }

    // file upload service
    async uploadFile(file) {
        try {
            return await this.bucket.createFile({
                bucketId: conf.appwriteBucketId,
                fileId: ID.unique(),
                file
            });
        } catch (error) {
            console.log(`Error in uploadFile: ${error}`);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile({
                bucketId: conf.appwriteBucketId,
                fileId
            });
            return true;
        } catch (error) {
            console.log(`Error in deleteFile: ${error}`);
            return false;
        }
    }

    // getFilePreview(fileId) {
    //     return this.bucket.getFilePreview({
    //         bucketId: conf.appwriteBucketId,
    //         fileId
    //     });
    // }
    getFilePreview(fileId) {
    return this.bucket.getFileView({
        bucketId: conf.appwriteBucketId,
        fileId
    });
}
    
}


const service = new Service();
export default service;
