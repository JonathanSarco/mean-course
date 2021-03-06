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
                    id: post._id,
                    imagePath: post.imagePath
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
        return this.httpClient.get<
            {_id: string, title: string, content: string, imagePath: string}>
                ('http://localhost:3000/api/posts/' + id);
    }

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        this.httpClient
            .post<{message: string, post: Post}>(
                'http://localhost:3000/api/posts', postData)
            .subscribe((responseData) => {
                const post: Post = {
                    id: responseData.post.id, 
                    title: title, 
                    content: content,
                    imagePath: responseData.post.imagePath
                };
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
                this.router.navigate(['/']);
            });
    }

    updatePost(id: string, title: string, content: string, image: File | string) {
        let postData: Post | FormData;
        // We check for object, because the string is not an object and the file yes
        if (typeof(image) === 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image
            };
        }

        this.httpClient.put('http://localhost:3000/api/posts/' + id, postData)
            .subscribe(response => {
                const updatePost = [...this.posts];
                const oldPostIndex = updatePost.findIndex(p => p.id === id);
                const post: Post = {
                    id: id,
                    title: title,
                    content: content,
                    imagePath: ""
                };

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
