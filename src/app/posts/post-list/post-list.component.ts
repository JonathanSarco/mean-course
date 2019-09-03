import { Component, Input } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  // posts = [
  //   {title: 'first post', content: 'this is the first posts'},
  //   {title: 'second post', content: 'this is the second posts'},
  //   {title: 'third post', content: 'this is the third posts'}
  // ];

    @Input() posts: Post[] = [];
}
