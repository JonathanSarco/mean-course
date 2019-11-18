import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private postsOnSub: Subscription;
  public isLoading = false;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts();
    this.isLoading = true;
    this.postsOnSub = this.postService.getPostsUpdatedListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.postsOnSub.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
