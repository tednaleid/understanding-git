# Understanding Git 

by <a href="http://naleid.com">Ted Naleid</a>

!SLIDE shout scanlines

# Understanding Git 

## by <a href="http://naleid.com">Ted Naleid</a>

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

!SLIDE shout
# git mislabels things

## ex: git branches aren't what you think they are

!SLIDE shout
# throw away your preconceptions from other version control systems

!SLIDE shout

# git is a<br/>filesystem-based object database 

!SLIDE


!SLIDE 
commits form a DAG (directed acyclic graph)

                  E---F---G 
                 /
            A---B---C---D-----------K---L---M 
                         \         /
                          H---I---J


!SLIDE 
DAG nodes each represent a commit

                  E---F---G 
                 /
            A---B---C---D-----------K---L---M 
                         \         /
                          H---I---J
                                       


!SLIDE

The ability to see this DAG, understand your current position in it, and reason about how to make the changes you want to it is _the most important thing to understand_


!SLIDE 
# Every Commit has a Unique ID 

```
% cat .git/refs/heads/master                  
3739fd313542160733035fc44a386229718989dc

% git cat-file -p 3739fd313542160733035fc44a386229718989dc         
tree e688b2a15544115cd85f5d6dcf00168b40847720
parent ff1eaa718bb1edbda05e0aee9b074c9635add720
parent f6ef529a26e885832dfbd1f2b156c31eb52b1f6c
author Ted Naleid <contact@naleid.com> 1397505233 -0500
committer Ted Naleid <contact@naleid.com> 1397505233 -0500

merging my-feature-branch into master
```

!SLIDE 
commits are completely immutable and are _impossible_ to accidentally destroy with git commands

<div class="smallercentered">
you can still <code>rm -rf yourrepo</code> and lose anything not yet pushed out
</div>

!SLIDE
uncommitted work is easily destroyed, so commit early &amp; often

!SLIDE 
you cannot modify commits, only add new ones

!SLIDE 
garbage collection is the only truly destructive git action 

!SLIDE 
garbage collection only destroys commits with _nothing_ pointing at them

!SLIDE 
# what points at commits? 

child commits

tags 

branches 

the reflog

!SLIDE 
# child commits 

point at 1..N parent commits 

```
                        E---F---G 
                       /
                  A---B---C---D 
```

<div class="smallercentered">
most commonly 1 or 2 parent commits
</div>

!SLIDE 

# tags 
fixed pointers

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
# branches 

floating pointers that move on commit

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
# branches 

they're just pointers, and are easy to move if you don't like where they are at
```
                  A---B---C
                          ↑
                        master
```

```
% git reset --hard SHA_OF_B
```

```
                  A---B---C
                      ↑
                    master
```


<div class="smallercentered">
commit <code>C</code> still exists and was not harmed by moving the pointer
</div>
<div class="smallestcentered">
we'll talk more about <code>reset</code> in a bit
</div>

!SLIDE 
# remote branches 
&#8220;remote&#8221; branches are just pointers in your local repo

```
                        origin/master
                              ↓
              A---B---C---D---E
                      ↑       
                    master    
```

<div class="smallercentered">
for most commands, there's nothing remote about them...they're just moved on a <code>fetch</code> or <code>pull</code>
</div>

!SLIDE 
# branches 
just text files in <code>.git/refs/heads</code> (local) and <code>.git/refs/remotes</code> (remote)

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
# branches 

branch text file contains is the SHA of the commit it's pointing at

```
% cat .git/refs/heads/master 
0981e8c8ffbd3a1277dda1173fb6f5cbf4750d51
```

```
% git cat-file -p 0981e8c8ffbd3a1277dda1173fb6f5cbf4750d51
tree 4fd7894316b4659ef3f53426166697858d51a291
parent e324971ecf1e0f626d4ba8b0adfc22465091c100
parent d33700dde6d38b051ba240ee97d685afdaf07515
author Ted Naleid &lt;contact@naleid.com&gt; 1328567163 -0800
committer Ted Naleid &lt;contact@naleid.com&gt; 1328567163 -0800

merge commit of two branches
```

!SLIDE 
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

<div class="smallercentered">
<code>master</code> is <code>A-B-C-D</code> and <code>feature</code> is <code>A-B-E-F-G</code>
</div>

!SLIDE
# HEAD 

<code>HEAD</code> is the active commit that will be the parent of the next commit

```
% cat .git/HEAD
ref: refs/heads/master
```

<div class="smallercentered">
most of the time it points to a branch, but can point directly to a SHA when &#8220;detached&#8221;
</div>


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


<div class="smallercentered">
by default it contains up to two weeks of history
</div>

!SLIDE 
# the reflog 
unique to a repository instance

a garbage collected commit can still exist in a clone

!SLIDE 
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

<div class="smallercentered">
<code>C..F</code> are now dangling
</div>

!SLIDE 
# dangling commit 

but they will be safe for ~2 weeks because of the reflog

```
                                     HEAD@{1}
                                        ↓
                    A---B---C---D---E---F
                        ↑
                     master (also HEAD@{0})

```

<div class="smallercentered">
<code>HEAD@{1}</code> will become <code>HEAD@{2}</code>..<code>HEAD@{N}</code> as refs are added to the reflog
</div>

!SLIDE 
# garbage collection 
once a dangling commit leaves the reflog, it is &#8220;loose&#8221; and is at risk of garbage collection

!SLIDE 
# garbage collection 
git does a <code>gc</code> when the number of &#8220;loose&#8221; objects hits a threshold

<div class="smallestcentered">
something like every 1000 commits 
</div>

!SLIDE 
# garbage collection 
to prevent garbage collecting a commit, just point something at it

```
% git tag mytag SHA_OF_DANGLING_COMMIT
```

!SLIDE 
you should have courage to experiment 

you have _weeks_ to retrieve prior commits if something doesn't work

!SLIDE

# the index 

a pre-commit staging area

<div class="smallercentered">
    <code>git add .</code> puts all changes in the index ready for commit
</div>

<div class="smallestcentered">
    some users bypass the index and commit directly with <code>git commit -a -m "msg"</code>
</div>


!SLIDE shout myth
# git syntax is terrible
## myth #3

!SLIDE shout 
#  git syntax is<br/>_really terrible_
## reality

!SLIDE shout
# Learn<br/>"the good parts" and make them your own

!SLIDE 
# reset --soft 

1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code>
2. index - unchanged 
3. working directory - unchanged 

```
                    A---B---C---D---E
                                    ↑
                                  master
```

```
git reset --soft SHA_OF_C
```

```
                    working dir &amp; index still look like
                                    ↓
                    A---B---C---D---E
                            ↑
                          master
```


!SLIDE 
# reset --soft 

useful for squashing the last few messy commits into one pristine commit
```
                    working dir &amp; index still look like
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
# reset (default)

```
git reset [--mixed] &lt;SHA&gt;
```

1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code> 
2. clean the index, make it look like <code>&lt;SHA&gt;</code> 
3. working directory - unchanged

<div class="smallercentered">
<code>git reset HEAD</code> will unstage everything in the index
</div>

!SLIDE 
# reset --hard
```
git reset --hard &lt;SHA&gt;
```

1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code> 
2. clean the index, make it look like <code>&lt;SHA&gt;</code> 
3. clean the working copy, make it look like <code>&lt;SHA&gt;</code> 

<p/>
<div class="smallercentered">
<span class="danger">dangerous</span> if you have <span class="danger">uncommitted work</span>, useful for undoing bad commits
</div>

!SLIDE 
# reset --hard HEAD 
```
git reset --hard HEAD
```

<div class="smallercentered">
just means clean out the working directory and any staged information, don't move the branch pointer
</div>

<div class="smallestcentered">
for more info on <code>reset</code>, see: <a href="http://progit.org/2011/07/11/reset.html">http://progit.org/2011/07/11/reset.html</a>
</div>

!SLIDE
# commit --amend

redo the last commit
```
                        A---B---C
                                ↑    
                            master+HEAD
```

```
&lt;... change some files ... &gt;
git commit --amend -m "New commit message"
```
```
                         master+HEAD
                              ↓
                              C'
                             /
                        A---B---C
                                ↑    
                  (dangling but still in reflog)
```


!SLIDE
# recovering commits
<div class="smallercentered">
Oops, I really wanted <code>C</code>!
</div>
```
                         master+HEAD
                              ↓
                              C'
                             /
                        A---B---C
                                ↑    
                            (dangling)
```
```
git reflog  # find SHA_OF_C 
git reset --hard SHA_OF_C
```
```
                         (dangling)
                              ↓
                              C'
                             /
                        A---B---C
                                ↑    
                            master+HEAD
```



!SLIDE 
# rebasing 

reapplies a series of commits to a new parent commit

then moves the current branch pointer

!SLIDE 
# rebasing 

```
                                feature+HEAD
                                      ↓
                              E---F---G 
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
                              E---F---G
                             /
                        A---B---C---D---E'--F'--G'
                                    ↑           ↑ 
                                  master  feature+HEAD
```

!SLIDE 
# rebasing 
a private activity, should never be done with commits that have been pushed

!SLIDE
# rebasing 
rebasing public commits is bad because it creates redundant commits with new SHAs 

!SLIDE
# rebasing 
if you want to clean things up, an alternative is to create another branch, rebase onto that and push it out

!SLIDE 
# squashing 

compresses N commits into one commit that's appended to a destination branch

!SLIDE 
# squashing 

```
                                           feature
                                              ↓
                                      E---F---G 
                                     /
                        A---B---C---D 
                                    ↑ 
                               master+HEAD
```

```
git merge --squash feature
```

```
                                           feature
                                              ↓
                                      E---F---G 
                                     /
                        A---B---C---D---G' 
                                        ↑ 
                                   master+HEAD
```

<div class="smallestcentered">
squashing is used to clean up history, when the thinking behind <code>E..F</code> is unimportant
</div>


!SLIDE 
# cherry picking 

apply a subset of changes from another branch

```
                              E---F---G 
                             /
                        A---B---C---D 
                                    ↑ 
                               master+HEAD
```

```
git cherry-pick SHA_OF_F
```

```
                              E---F---G 
                             /
                        A---B---C---D---F' 
                                        ↑ 
                                   master+HEAD
```


!SLIDE 
# fetch 

download new commits and update the remote branch pointer

does not move any local references

!SLIDE 
# fetch 

```
                     A---B---E---F   
(origin)                         ↑ 
                              master (in remote repo)  

                   origin/master
                         ↓
(local)              A---B---C---D 
                                 ↑ 
                              master+HEAD
```

```
% git fetch
```


```
                         origin/master
                               ↓
                           E---F
                          /
(local)              A---B---C---D 
                                 ↑ 
                              master+HEAD
```


!SLIDE 
# pull 

<code>pull</code> is <code>fetch</code> plus <code>merge</code>

!SLIDE 
# pull 

```
                     A---B---E---F   
(origin)                         ↑ 
                              master (local ref in remote repo)  


                   origin/master
                         ↓
(local)              A---B---C---D 
                                 ↑ 
                              master+HEAD
```

```
% git pull
```


```
                         origin/master
                               ↓
                           E---F----
                          /         \
(local)              A---B---C---D---G 
                                     ↑ 
                                  master+HEAD
```

!SLIDE 
the "right" way to pull down changes from the server

1. <code>stash</code> any uncommitted changes (if any)
2. <code>fetch</code> the latest refs and commits from origin
3. <code>rebase -p</code> your changes (if any) onto origin's head
4. else, just fast-forward your head to match origin's
5. un-<code>stash</code> any previously stashed changes

<p>
<div class="smallercentered">
<code>fetch</code> + <code>rebase</code> avoids unnecessary commits
</div>

!SLIDE
Luckily, <code>git smart-pull</code> (part of the git-smart ruby gem) does all this for us

```
gem install git-smart
```


!SLIDE shout
# Questions? 


