import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class PostService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post[]>();

    constructor(private httpClient: HttpClient) {}

    getPosts() {
        this.httpClient.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
            .subscribe((postData) => {
                this.posts = postData.posts;
                this.postsUpdated.next([...this.posts]);
            });
    }

    getPostsUpdatedListener() {
        return this.postsUpdated.asObservable();
    }
    addPost(title: string, content: string) {
        const post: Post = {id: null, title: title, content: content};
        this.httpClient.post<{message: string}>('http://localhost:3000/api/posts', post)
            .subscribe((responseData) => {
                console.log(responseData);
                this.posts.push(post);
                this.postsUpdated.next([...this.posts]);
            });
    }
}
