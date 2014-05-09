# Understanding Git 

by <a href="https://twitter.com/tednaleid">@tednaleid</a>

!SLIDE shout

# Understanding Git 

## by <a href="https://twitter.com/tednaleid">@tednaleid</a>

!SLIDE quieter shout

# you can't modify commits<br/><br/>only add new ones

!SLIDE quietest shout 
# commits are completely immutable and are _impossible_ to accidentally destroy with git commands

## though <code>rm -rf .git</code> will lose anything not yet pushed out

!SLIDE quieter shout 
# uncommitted work is easily destroyed, so commit early &amp; often

!SLIDE quieter shout

# garbage collection is the only truly destructive git action 

!SLIDE quietest shout
# garbage collection only destroys commits with _nothing_ pointing at them

!SLIDE 
# what points at commits? 

# other commits

# tags 

# branches 

# the reflog

!SLIDE 
<br/>
# commit

point at 0..N parent commits 

```
                              E---F---G 
                             /
                        A---B---C---D 
```

most commonly 1 or 2 parent commits

!SLIDE 

# tag 
fixed commit pointers

```
                      A---B---C 
                              ↑
                         release_1.0
```

```
    % git commit -m "adding stuff to C"
```

```
                      A---B---C---D 
                              ↑
                         release_1.0
```

!SLIDE 
# branch 

floating commit pointer

```
                          A---B
                              ↑
                            master
```

```
% git commit -m "adding stuff to B"
```

```
                          A---B---C
                                  ↑
                                master
```

!SLIDE 
# remote branch 
a &#8220;remote&#8221; branch is just a commit pointer in your local repo

```
                                 master
                                    ↓
                    A---B---C---D---E
                            ↑       
                      origin/master    
```

it's updated whenever you do a `fetch` or `pull`, otherwise nothing remote about them

!SLIDE 
# branch

text files in the `.git` directory

```
% ls -1 .git/refs/heads/**/*
.git/refs/heads/master
.git/refs/heads/my_feature_branch
```

```
% ls -1 .git/refs/remotes/**/*  
.git/refs/remotes/origin/HEAD
.git/refs/remotes/origin/master
.git/refs/remotes/origin/my_feature_branch
```

!SLIDE 
# branch 

contains is the SHA of the commit it's pointing at

```
% cat .git/refs/heads/master 
0981e8c8ffbd3a1277dda1173fb6f5cbf4750d51

# .git/objects/09/81e8c8ffbd3a1277dda1173fb6f5cbf4750d51
```

!SLIDE 
# branches point at commits 

Contain `tree` (filesystem), `parent` commits and commit metadata
```
% git cat-file -p 0981e8c8ffbd3a1277dda1173fb6f5cbf4750d51
tree 4fd7894316b4659ef3f53426166697858d51a291
parent e324971ecf1e0f626d4ba8b0adfc22465091c100
parent d33700dde6d38b051ba240ee97d685afdaf07515
author Ted Naleid <contact@naleid.com> 1328567163 -0800
committer Ted Naleid <contact@naleid.com> 1328567163 -0800

merge commit of two branches
```

The ID is the SHA of the commit's contents

!SLIDE 
<br/>
# branches 
commits don't &#8220;belong to&#8221; branches, there's nothing in the commit metadata about branches

!SLIDE 
# branches 
a branch's commits are implied by the ancestry of the commit the branch points at

```
                                 feature
                                    ↓
                            E---F---G 
                           /
                      A---B---C---D 
                                  ↑ 
                                master
```

<code>master</code> is <code>A-B-C-D</code> and <code>feature</code> is <code>A-B-E-F-G</code>

!SLIDE
# HEAD 

<code>HEAD</code> is the current branch/commit 

This will be the parent of the next commit

```
% cat .git/HEAD
ref: refs/heads/master
```

most of the time it points to a branch, but can point directly to a SHA when &#8220;detached&#8221;


!SLIDE 
# the reflog 
a log of recent <code>HEAD</code> movement

```
% git reflog                                       
d72efc4 HEAD@{0}: commit: adding bar.txt
6435f38 HEAD@{1}: commit (initial): adding foo.txt
```

```
% git commit -m "adding baz.txt"
```

```
% git reflog                                       
b5416cb HEAD@{0}: commit: adding baz.txt
d72efc4 HEAD@{1}: commit: adding bar.txt
6435f38 HEAD@{2}: commit (initial): adding foo.txt
```

by default it keeps at least 30 days of history


!SLIDE 
<br/>
# the reflog 
unique to a repository instance

!SLIDE 
# the reflog 
can be scoped to a particular branch

```
% git reflog my_branch
347f5fe my_branch@{0}: merge master: Merge made by the recurs… 
4e6007e my_branch@{1}: merge origin/my_branch: Fast-forward
32834d8 my_branch@{2}: commit (amend): upgrade redis version
2720e40 my_branch@{3}: commit: upgrade redis version 
```

!SLIDE 
<br/>
# dangling commit 
if the only thing pointing to a commit is the reflog, it's &#8220;dangling&#8221;

!SLIDE 
# dangling commit 
```
                    A---B---C---D---E---F
                                        ↑
                                      master
```

```
% git reset --hard SHA_OF_B
```

```
                    A---B---C---D---E---F
                        ↑
                      master
```

<code>C..F</code> are now dangling

!SLIDE 
# dangling commit 

but they will be safe for ~30 days because of the reflog

```
                                     HEAD@{1}
                                        ↓
                    A---B---C---D---E---F
                        ↑
                     master (also HEAD@{0})

```

<code>HEAD@{1}</code> will become <code>HEAD@{2}</code>..<code>HEAD@{N}</code> as refs are added to the reflog

!SLIDE 
<br/>
# garbage collection 
once a dangling commit leaves the reflog, it is &#8220;loose&#8221; and is at risk of garbage collection

!SLIDE 
<br/>
# garbage collection 
git does a <code>gc</code> when the number of &#8220;loose&#8221; objects hits a threshold

something like every 1000 commits 

!SLIDE 
<br/>
# garbage collection 
to prevent garbage collecting a commit, just point something at it

```
% git tag mytag SHA_OF_DANGLING_COMMIT
```

!SLIDE

# the index 

a pre-commit staging area

<code>add -A :/</code> puts all changes in the index ready for commit

some bypass the index with <code>git commit -a -m "msg"</code>

!SLIDE 
<br/>

# you should have courage to experiment 

you have _weeks_ to retrieve prior commits if something doesn't work

!SLIDE shout

# understand where you are

## before you try to go somewhere else


!SLIDE quieter shout

# You need (at least) one repo visualization tool that you grok


!SLIDE 

# Here's Mine:

```
~/.gitconfig:
[alias]
  l = git log --graph --pretty='%h -%d %s [%an] (%cr)'
```
```
git l
```

```
*   245ab64 - Merge pull request #32 from michaelcamer…
|\
| * 54f1379 - Fix the implementation on soft setting the…
|/
* f88cc8d - prepare for release [Ted Naleid] (3 weeks ago)
*   9fa65f8 - Merge branch 'michaelcameron-warn-on-bad-p…
|\
| * c55baa7 - (michaelcameron-warn-on-bad-pool-config) W…
* | ed2c18f - prep for release [Ted Naleid] (3 weeks ago)
|/
* 1d87244 - updated release note for 1.5.1 [Ted Naleid] …
```

!SLIDE

# There are others - Git Tower

<img src="images/tower.png" alt="">

!SLIDE

# There are others - SourceTree

<img src="images/sourcetree.png" alt="">

!SLIDE shout
# Learn<br/>&#8220;the good parts&#8221; and make them your own

!SLIDE quieter shout

# `reset` is for moving branch pointers

!SLIDE 
# reset --hard
```
git reset --hard <SHA>
```

<br/>
1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code> 
2. clean the index, make it look like <code>&lt;SHA&gt;</code> 
3. clean the working copy, make it look like <code>&lt;SHA&gt;</code> 

<span class="danger">dangerous</span> if you have <span class="danger">uncommitted work</span>, useful for undoing bad commits

!SLIDE 
# reset --hard HEAD 
```
git reset --hard HEAD
```

just means clean out the working directory and any staged information, don't move the branch pointer

for more info on <code>reset</code>, see: <a href="http://progit.org/2011/07/11/reset.html">http://progit.org/2011/07/11/reset.html</a>


!SLIDE 
# reset --soft 

```
                    A---B---C---D---E
                                    ↑
                                  master
```

```
git reset --soft SHA_OF_C
```

```
                    working dir & index still look like
                                    ↓
                    A---B---C---D---E
                            ↑
                          master
```
1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code>
2. index - unchanged 
3. working directory - unchanged 


!SLIDE 
# reset --soft 

useful for squashing the last few messy commits into one pristine commit
```
                    working dir & index still look like
                                    ↓
                    A---B---C---D---E
                            ↑
                          master
```

```
git commit -m "perfect code on the 'first' try"
```

```
                    A---B---C---E'
                                ↑
                              master
```

!SLIDE 
# reset --soft 

What if you've got a more complicated situation:

```
                              master
                                ↓
                A---B---C---D---E 
                 \       \
                  F---G---H---I ← feature & HEAD
```

Can't `reset` our way out of this, right?

!SLIDE 
# reset --soft 

Just do one last merge

```
git merge master
```

```
                              master
                                ↓
                A---B---C---D---E 
                 \       \       \
                  F---G---H---I---J ← feature & HEAD
```

!SLIDE 
# reset --soft 

and then we can `reset` into a single commit 

```
git reset --soft master
```

```
                A---B---C---D---E ← feature & HEAD & master
                                 \
                                  J ← working dir & index 
```

```
git commit -m "pristine J"
```

```
                              master
                                ↓
                A---B---C---D---E---J' ← feature & HEAD 
```





!SLIDE 
<br/>
# rebasing 

reapplies a series of commits to a new parent commit

then moves the current branch pointer

!SLIDE 
# rebasing 

```
                        E---F  ← feature & HEAD
                       /
                  A---B---C---D 
                              ↑ 
                           master
```

```
   git rebase master
```

```
                  (dangling but still in reflog)
                            ↓
                        E---F
                       /
                  A---B---C---D---E'--F'
                              ↑       ↑ 
                           master  feature & HEAD
```

!SLIDE 
# rebasing 

```
git rebase --abort
```

If you get in trouble `--abort` and try again.  

If you _really_ get in trouble, you can `reset --hard` back to your last commit.

!SLIDE 
<br/>
# rebasing - a private activity
should never be done with commits that have been pushed

!SLIDE
<br/>
# rebasing - a private activity
public rebasing is bad as others could have the same commits with different SHAs


!SLIDE 
# cherry picking 

apply a subset of changes from another branch

```
                            E---F---G 
                           /
                      A---B---C---D 
                                  ↑ 
                             master & HEAD
```

```
git cherry-pick SHA_OF_F
```

```
                            E---F---G 
                           /
                      A---B---C---D---F' 
                                      ↑ 
                                 master & HEAD
```


!SLIDE 
<br/>
# fetch 

download new commits and update the remote branch pointer

does not move any local branches

!SLIDE 
# fetch 

```
                     A---B---E---F   
(origin)                         ↑ 
                              master (in remote repo)  
```
```
                   origin/master
(local)                  ↓
                     A---B---C---D ← master & HEAD 
```

```
% git fetch
```


```
                         origin/master
                               ↓
                           E---F
(local)                   /
                     A---B---C---D ← master & HEAD
```


!SLIDE 
<br/>
# pull 

<code>pull</code> is <code>fetch</code> plus <code>merge</code>

!SLIDE 
# pull 

```

                   origin/master
(local)                  ↓
                     A---B---C---D ← master & HEAD
```
```
                     A---B---E---F   
(origin)                         ↑ 
                              master (local ref in remote repo)  
```

```
% git pull
```


```
                         origin/master
                               ↓
                           E---F----
                          /         \
(local)              A---B---C---D---G ← master & HEAD
```

!SLIDE 
# the &#8220;right&#8221; way to pull down changes from the server

1. <code>stash</code> any uncommitted changes (if any)
2. <code>fetch</code> the latest refs and commits from origin
3. <code>rebase -p</code> your changes (if any) onto origin's head
4. else, just fast-forward your head to match origin's
5. un-<code>stash</code> any previously stashed changes

<code>fetch</code> + <code>rebase</code> avoids unnecessary commits

!SLIDE

# rebasing pull
<br/>
As of git 1.8.5, git has finally added a rebase switch to `pull`:

```
git pull --rebase
```

This will do the `fetch` + `rebase` for you (you still stash on your own).

!SLIDE shout myth
# git is dangerous 
## myth #1

!SLIDE shout
# git is the _safest_ version control 
## reality

!SLIDE shout myth
# git lets you<br/>rewrite history
## myth #2

!SLIDE shout
# rewriting <br/>history is a _lie_
## reality

!SLIDE shout myth
# git syntax is terrible
## myth #3

!SLIDE shout 
#  git syntax is<br/>_really terrible_
## reality

!SLIDE shout
# git mislabels things

## ex: git branches aren't what you think they are

!SLIDE shout
# throw away your preconceptions from other version control systems

!SLIDE shout
# Questions? 


!SLIDE shout
# Bonus Section!

!SLIDE 
# reset (default)

```
git reset [--mixed] <SHA>
```

<br/>

1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code> 
2. clean the index, make it look like <code>&lt;SHA&gt;</code> 
3. working directory - unchanged

<code>git reset HEAD</code> will unstage everything in the index

!SLIDE
# commit --amend

redo the last commit
```
                        A---B---C
                                ↑    
                          master & HEAD
```

```
<... change some files ... > 
commit -a --amend --no-edit
```
```
                              C' ← master & HEAD
                             /
                        A---B---C
                                ↑    
                  (dangling but still in reflog)
```

!SLIDE 
<br/>
# squashing 

compresses N commits into one commit that's appended to a destination branch

!SLIDE 
# squashing 

```
                              E---F---G ← feature
                             /
                A---B---C---D 
                            ↑ 
                     master & HEAD
```

```
git merge --squash feature
```

```
                              E---F---G ← feature
                             /
                A---B---C---D---G' 
                                ↑ 
                         master & HEAD
```

cleans up history, when the thinking behind <code>E..F</code> is unimportant

!SLIDE

# recovering commits

Oops, I really wanted <code>C</code>!

```
                              C' ← master & HEAD
                             /
                        A---B---C ← (dangling)
```
```
git reflog  # find SHA_OF_C 
git reset --hard SHA_OF_C
```
```
                              C' ← (dangling)
                             /
                        A---B---C
                                ↑    
                            master & HEAD
```