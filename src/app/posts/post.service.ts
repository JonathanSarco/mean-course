import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { throwToolbarMixedModesError } from '@angular/material';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient, private router: Router) {}

    getPosts() {
        this.httpClient
        .get<{message: string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(map( (postData) => {
            return postData.posts.map(post => {
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
        }))
        .subscribe((resultPosts) => {
            this.posts = resultPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    getPost(id: string) {
        return this.httpClient.get<{_id: string, title: string, content: string}>('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title: title, content: content};

        this.httpClient
            .post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                post.id = responseData.postId;
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    updatePost(id: string, title: string, content: string) {
        const post: Post = {
            id: id,
            title: title,
            content: content
        };

        this.httpClient.put('http://localhost:3000/api/posts/' + id, post)
            .subscribe(response => {
                const updatePost = [...this.posts];
                const oldPostIndex = updatePost.findIndex(p => p.id === post.id);
                updatePost[oldPostIndex] = post;
                this.posts = updatePost;
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    deletePost(postId: string) {
        this.httpClient.delete( 'http://localhost:3000/api/posts/' + postId)
            .subscribe(() => {
                const updatedPost = this.posts.filter(post => post.id !== postId);
                this.posts = updatedPost;
                this.postsUpdated.next([...this.posts]);
            });
    }
}
