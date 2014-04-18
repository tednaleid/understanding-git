!SLIDE 
# Understanding Git #

<p class="note">by <a href="http://naleid.com">Ted Naleid</a></p>

<p class="note">
Presentation: <a href="http://tednaleid.github.com/understanding-git-presentation">tednaleid.github.com/understanding-git-presentation</a> 
</p>


!SLIDE 
## tl;dr 
rewriting history is a lie

git commits are immutable and cannot be &#8220;rewritten&#8221;

!SLIDE 
# tl;dr #
you only add to history

garbage collection removes unwanted commits weeks later

!SLIDE center
# git is the safest VCS I know #

<pre class="ascii-art">

              ____
              \   \__       ____
               \   \/_______\___\_________
                \/_/   o o o o o o o o o  `-..
                 `-----------/~~~~/----------'
                            /____/


</pre>

!SLIDE center
# if you know a few concepts #


!SLIDE center
# if you don't…it gets ugly fast #

<pre class="ascii-art">

                     __.-^^---....,,-,
                  _--                 \--_
                 (                       ^)
                 (                         )
                  \._                   _./
                     ``---\ ! ! , /---''
                           |  |  |
                        .--| ! ! |--.
                        `==#######=='
                           | !  !|
                        ,-#########~,._

</pre>

!SLIDE 
git doesn't help by having a _terrible_ user interface

!SLIDE 
git mislabels things in confusing ways

<div class="small centered">
    ex: git branches aren't branches
</div>

!SLIDE 
git has hundreds of commands, but commonly used ones require extra parameters

!SLIDE 
git uses dangerous-sounding terms:

<div class="centered smaller">
<p>&#8220;rewrite history&#8221;</p>

<p>rebase</p> 

<p>reset --hard HEAD</p>

<p>squash</p>

<p>fast-forward</p>

<p>reflog</p>
</div>

!SLIDE 
throw away your preconceptions from other version control systems

!SLIDE 
# Git Core Concepts #

!SLIDE 
git is a DAG (directed acyclic graph)

<pre>
                      E---F---G 
                     /
                A---B---C---D-----------K---L---M 
                             \         /
                              H---I---J
</pre>


!SLIDE 
DAG nodes each represent a commit

<pre>
                      E---F---G 
                     /
                A---B---C---D-----------K---L---M 
                             \         /
                              H---I---J
                                           
</pre>


!SLIDE 
A commit is identified by a unique SHA

<pre>
% cat .git/refs/heads/master                  
f643986c985998abd74076afe0247c81e0399512

% git cat-file -p f643986 
tree 392739b5a3de25773c163ae91191d3360811d302
parent 94381141d087e9354b34ae76d2ab064a39b1cc69
author Ted Naleid &lt;contact@naleid.com&gt; 1343694118 -0500
committer Ted Naleid &lt;contact@naleid.com&gt; 1343698088 -0500

adding _amazing_ ascii art
</pre>

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
# what points at commits? #

child commits

tags 

branches 

the reflog

!SLIDE 
# child commits #

point at 1..N parent commits 

<pre>
                              E---F---G 
                             /
                        A---B---C---D 
</pre>

<div class="smallercentered">
most commonly 1 or 2 parent commits
</div>




!SLIDE 
# tags #
fixed pointers

<pre>
                        A---B---C 
                                ↑
                           release_1.0
</pre>

<pre>
% git commit -m "adding stuff to C"
</pre>

<pre>
                        A---B---C---D 
                                ↑
                           release_1.0
</pre>


!SLIDE 
# branches #

floating pointers that move on commit

<pre>
                        A---B
                            ↑
                          master
</pre>

<pre>
% git commit -m "adding stuff to B"
</pre>

<pre>
                        A---B---C
                                ↑
                              master
</pre>


!SLIDE 
# branches #

they're just pointers, and are easy to move if you don't like where they are at
<pre>
                        A---B---C
                                ↑
                              master
</pre>

<pre>
% git reset --hard SHA_OF_B
</pre>

<pre>
                        A---B---C
                            ↑
                          master
</pre>

<div class="smallercentered">
commit <code>C</code> still exists and was not harmed by moving the pointer
</div>
<div class="smallestcentered">
we'll talk more about <code>reset</code> in a bit
</div>

!SLIDE 
# remote branches #
&#8220;remote&#8221; branches are just pointers in your local repo

<pre>
                              origin/master
                                    ↓
                    A---B---C---D---E
                            ↑       
                          master    
</pre>

<div class="smallercentered">
for most commands, there's nothing remote about them...they're just moved on a <code>fetch</code> or <code>pull</code>
</div>

!SLIDE 
# branches #
just text files in <code>.git/refs/heads</code> (local) and <code>.git/refs/remotes</code> (remote)

<pre>
% ls -1 .git/refs/heads/**/*
.git/refs/heads/master
.git/refs/heads/my_feature_branch
</pre>

<pre>
% ls -1 .git/refs/remotes/**/*  
.git/refs/remotes/origin/HEAD
.git/refs/remotes/origin/master
.git/refs/remotes/origin/my_feature_branch
</pre>

!SLIDE 
# branches #

branch text file contains is the SHA of the commit it's pointing at

<pre>
% cat .git/refs/heads/master 
0981e8c8ffbd3a1277dda1173fb6f5cbf4750d51
</pre>

<pre>
% git cat-file -p 0981e8c8ffbd3a1277dda1173fb6f5cbf4750d51
tree 4fd7894316b4659ef3f53426166697858d51a291
parent e324971ecf1e0f626d4ba8b0adfc22465091c100
parent d33700dde6d38b051ba240ee97d685afdaf07515
author Ted Naleid &lt;contact@naleid.com&gt; 1328567163 -0800
committer Ted Naleid &lt;contact@naleid.com&gt; 1328567163 -0800

merge commit of two branches
</pre>

!SLIDE 
# branches #
commits don't &#8220;belong to&#8221; branches, there's nothing in the commit metadata about branches

!SLIDE 
# branches #
a branch's commits are implied by the ancestry of the commit the branch points at

<pre>
                                   feature
                                      ↓
                              E---F---G 
                             /
                        A---B---C---D 
                                    ↑ 
                                  master
</pre>

<div class="smallercentered">
<code>master</code> is <code>A-B-C-D</code> and <code>feature</code> is <code>A-B-E-F-G</code>
</div>

!SLIDE
# HEAD #

<code>HEAD</code> is the active commit that will be the parent of the next commit
<pre>
% cat .git/HEAD
ref: refs/heads/master
</pre>

<div class="smallercentered">
most of the time it points to a branch, but can point directly to a SHA when &#8220;detached&#8221;
</div>


!SLIDE 
# the reflog #
a log of recent <code>HEAD</code> movement

<pre>
% git reflog                                       
d72efc4 HEAD@{0}: commit: adding bar.txt
6435f38 HEAD@{1}: commit (initial): adding foo.txt
</pre>

<pre>
% git commit -m "adding baz.txt"
</pre>

<pre>
% git reflog                                       
b5416cb HEAD@{0}: commit: adding baz.txt
d72efc4 HEAD@{1}: commit: adding bar.txt
6435f38 HEAD@{2}: commit (initial): adding foo.txt
</pre>


<div class="smallercentered">
by default it contains up to two weeks of history
</div>

!SLIDE 
# the reflog #
unique to a repository instance

a garbage collected commit can still exist in a clone

!SLIDE 
# dangling commit #
if the only thing pointing to a commit is the reflog, it's &#8220;dangling&#8221;

!SLIDE 
# dangling commit #
<pre>
                    A---B---C---D---E---F
                                        ↑
                                      master
</pre>

<pre>
% git reset --hard SHA_OF_B
</pre>

<pre>
                    A---B---C---D---E---F
                        ↑
                      master

</pre>

<div class="smallercentered">
<code>C..F</code> are now dangling
</div>

!SLIDE 
# dangling commit #

but they will be safe for ~2 weeks because of the reflog

<pre>
                                     HEAD@{1}
                                        ↓
                    A---B---C---D---E---F
                        ↑
                     master (also HEAD@{0})

</pre>

<div class="smallercentered">
<code>HEAD@{1}</code> will become <code>HEAD@{2}</code>..<code>HEAD@{N}</code> as refs are added to the reflog
</div>

!SLIDE 
# garbage collection #
once a dangling commit leaves the reflog, it is &#8220;loose&#8221; and is at risk of garbage collection

!SLIDE 
# garbage collection #
git does a <code>gc</code> when the number of &#8220;loose&#8221; objects hits a threshold

<div class="smallestcentered">
something like every 1000 commits 
</div>

!SLIDE 
# garbage collection #
to prevent garbage collecting a commit, just point something at it

<pre>
% git tag mytag SHA_OF_DANGLING_COMMIT
</pre>

!SLIDE 
you should have courage to experiment 

you have _weeks_ to retrieve prior commits if something doesn't work

!SLIDE

# the index #

a pre-commit staging area

<div class="smallercentered">
    <code>git add .</code> puts all changes in the index ready for commit
</div>

<div class="smallestcentered">
    some users bypass the index and commit directly with <code>git commit -a -m "msg"</code>
</div>


!SLIDE
# Git Command Tips #


!SLIDE 
# reset --soft #

1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code>
2. index - unchanged 
3. working directory - unchanged 

<pre>
                    A---B---C---D---E
                                    ↑
                                  master
</pre>
<pre>
git reset --soft SHA_OF_C
</pre>
<pre>
                    working dir &amp; index still look like
                                    ↓
                    A---B---C---D---E
                            ↑
                          master
</pre>


!SLIDE 
# reset --soft #

useful for squashing the last few messy commits into one pristine commit
<pre>
                    working dir &amp; index still look like
                                    ↓
                    A---B---C---D---E
                            ↑
                          master
</pre>

<pre>
git commit -m "perfect code on the 'first' try"
</pre>

<pre>
                    A---B---C---E'
                                ↑
                              master
</pre>


!SLIDE 
# reset (default)#
<pre>
git reset [--mixed] &lt;SHA&gt;
</pre>

1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code> 
2. clean the index, make it look like <code>&lt;SHA&gt;</code> 
3. working directory - unchanged

<div class="smallercentered">
<code>git reset HEAD</code> will unstage everything in the index
</div>

!SLIDE 
# reset --hard#
<pre>
git reset --hard &lt;SHA&gt;
</pre>

1. moves <code>HEAD</code> & the current branch to the specified <code>&lt;SHA&gt;</code> 
2. clean the index, make it look like <code>&lt;SHA&gt;</code> 
3. clean the working copy, make it look like <code>&lt;SHA&gt;</code> 

<p/>
<div class="smallercentered">
<span class="danger">dangerous</span> if you have <span class="danger">uncommitted work</span>, useful for undoing bad commits
</div>

!SLIDE 
# reset --hard HEAD #
<pre>
git reset --hard HEAD
</pre>

<div class="smallercentered">
just means clean out the working directory and any staged information, don't move the branch pointer
</div>

<div class="smallestcentered">
for more info on <code>reset</code>, see: <a href="http://progit.org/2011/07/11/reset.html">http://progit.org/2011/07/11/reset.html</a>
</div>

!SLIDE
# commit --amend

redo the last commit
<pre>
                        A---B---C
                                ↑    
                            master+HEAD
</pre>

<pre>
&lt;... change some files ... &gt;
git commit --amend -m "New commit message"
</pre>
<pre>
                         master+HEAD
                              ↓
                              C'
                             /
                        A---B---C
                                ↑    
                  (dangling but still in reflog)
</pre>


!SLIDE
# recovering commits
<div class="smallercentered">
Oops, I really wanted <code>C</code>!
</div>
<pre>
                         master+HEAD
                              ↓
                              C'
                             /
                        A---B---C
                                ↑    
                            (dangling)
</pre>
<pre>
git reflog  # find SHA_OF_C 
git reset --hard SHA_OF_C
</pre>
<pre>
                         (dangling)
                              ↓
                              C'
                             /
                        A---B---C
                                ↑    
                            master+HEAD
</pre>



!SLIDE 
# rebasing #

reapplies a series of commits to a new parent commit

then moves the current branch pointer

!SLIDE 
# rebasing #

<pre>
                                feature+HEAD
                                      ↓
                              E---F---G 
                             /
                        A---B---C---D 
                                    ↑ 
                                  master
</pre>

<pre>
   git rebase master
</pre>

<pre>
                        (dangling but still in reflog)
                                      ↓
                              E---F---G
                             /
                        A---B---C---D---E'--F'--G'
                                    ↑           ↑ 
                                  master  feature+HEAD
</pre>

!SLIDE 
# rebasing #
a private activity, should never be done with commits that have been pushed

!SLIDE
# rebasing #
rebasing public commits is bad because it creates redundant commits with new SHAs 

!SLIDE
# rebasing #
if you want to clean things up, an alternative is to create another branch, rebase onto that and push it out

!SLIDE 
# squashing #

compresses N commits into one commit that's appended to a destination branch

!SLIDE 
# squashing #

<pre>
                                           feature
                                              ↓
                                      E---F---G 
                                     /
                        A---B---C---D 
                                    ↑ 
                               master+HEAD
</pre>

<pre>
git merge --squash feature
</pre>

<pre>
                                           feature
                                              ↓
                                      E---F---G 
                                     /
                        A---B---C---D---G' 
                                        ↑ 
                                   master+HEAD
</pre>

<div class="smallestcentered">
squashing is used to clean up history, when the thinking behind <code>E..F</code> is unimportant
</div>


!SLIDE 
# cherry picking #

apply a subset of changes from another branch

<pre>
                              E---F---G 
                             /
                        A---B---C---D 
                                    ↑ 
                               master+HEAD
</pre>

<pre>
git cherry-pick SHA_OF_F
</pre>

<pre>
                              E---F---G 
                             /
                        A---B---C---D---F' 
                                        ↑ 
                                   master+HEAD
</pre>


!SLIDE 
# fetch #

download new commits and update the remote branch pointer

does not move any local references

!SLIDE 
# fetch #

<pre>
                     A---B---E---F   
(origin)                         ↑ 
                              master (local ref in remote repo)  


                   origin/master
                         ↓
(local)              A---B---C---D 
                                 ↑ 
                              master+HEAD
</pre>

<pre>
% git fetch
</pre>


<pre>
                         origin/master
                               ↓
                           E---F
                          /
(local)              A---B---C---D 
                                 ↑ 
                              master+HEAD
</pre>


!SLIDE 
# pull #

<code>pull</code> is <code>fetch</code> plus <code>merge</code>

!SLIDE 
# pull #

<pre>
                     A---B---E---F   
(origin)                         ↑ 
                              master (local ref in remote repo)  


                   origin/master
                         ↓
(local)              A---B---C---D 
                                 ↑ 
                              master+HEAD
</pre>

<pre>
% git pull
</pre>


<pre>
                         origin/master
                               ↓
                           E---F----
                          /         \
(local)              A---B---C---D---G 
                                     ↑ 
                                  master+HEAD
</pre>

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

<pre>
gem install git-smart
</pre>


!SLIDE 
# Useful Git Tools #

!SLIDE center
# Git Tower #

Costs $ but totally worth it

<div class="smallestcentered">
tip: cmd-click a branch to unselect it and see the whole tree
</div>

<div class="smallestcentered">
OSX only, if you're on another platform, try <a href="http://www.atlassian.com/software/sourcetree/overview">Atlassian's free SourceTree</a>
</div>

!SLIDE center
# Enhanced Shell Prompt #


<div class="smallercentered">
decorated with branch &amp; SHA
</div>
<div class="smallestcentered">
check out <a href="https://peepcode.com/blog/2012/my-command-line-prompt">"my command line prompt"</a> by peepcode
</div>

!SLIDE
# git aliases #
   
<pre>
[alias]
  # nice one liner for status
  st = status --short    


  # remove files from index
  unstage = reset HEAD
</pre>

<div class="smallestcentered">
put these in your <code>~/.gitconfig</code>
</div>


!SLIDE
# git aliases #
   
<pre>
[alias]
  # pretty ascii graph log format
  l = log --graph --pretty='%Cred%h%Creset -%C(yellow)%d%Creset\
          %s %Cblue[%an]%Creset %Cgreen(%cr)%Creset'\
          --abbrev-commit --date=relative


  # pretty log with all branches
  la = !git l --all


  # show just commits currently decorated by branch/tag pointers 
  # really useful for high level picture
  ld = !git l --all --simplify-by-decoration 
</pre>

<div class="smallestcentered">
put these in your <code>~/.gitconfig</code>
</div>


!SLIDE
# git aliases #
   
<pre>
[alias]
  # all commits unreachable via branch, tag, or child commit
  # ignores anything pointed to by the reflog 
  # so it displays all commits in jeopardy of garbage collection
  loose-commits = !"for SHA in $(git fsck --unreachable\ 
                  --no-reflogs | grep commit |\
                  cut -d\\  -f 3); do git log -n 1 $SHA; done"
</pre>

<div class="smallestcentered">
put these in your <code>~/.gitconfig</code>
</div>

!SLIDE
# omglog #

OSX only…watches file system for changes &amp; auto updates ascii graph log

<pre>
gem install omglog
</pre>

<div class="smallestcentered">
currently requires ruby 1.9.X
</div>


!SLIDE
# Questions? #
