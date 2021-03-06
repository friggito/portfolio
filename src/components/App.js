import React, { useState, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { StaticRoutes, BlogPost, Footer, ProjectPage } from "./";
import "../styling/index.scss";
import { makeClient } from '../helpers';

//  Reset scroll when changing pages
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

history.listen((location, action) => {
  window.scrollTo(0, 0);
});


const client = makeClient();

const App = () => {
  const [projects, setProjects] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState({});

  useEffect(() => {
    const fetchProjects = async (client) => {
      try {
        const entries = await client.getEntries({ content_type: 'project' });
        setProjects(entries.items);
      } catch(err) {
        setError(err);
      }
    };

    const fetchBlogPosts = async (client) => {
      try {
        const entries = await client.getEntries({ content_type: 'blogPost' });
        setBlogPosts(entries.items);
      } catch(err) {
        setError(err);
      }
    };

    fetchProjects(client);
    fetchBlogPosts(client);
  }, [error]);

  return (
    <Router history={history}>
      <div className="App">
        <main id="content">
          <Switch>
            {projects.map((project, idx) => (
              <Route
                key={project.fields.title}
                exact
                path={`/${project.fields.slug}`}
                render={() => <ProjectPage idx={idx} project={project} projects={projects} />}
              />
            ))}
            {blogPosts.map((blogPost, idx) => (
              <Route
                key={blogPost.fields.title}
                exact
                path={`/${blogPost.fields.slug}`}
                render={() => <BlogPost idx={idx} blogPost={blogPost} />}
              />
            ))}
            <StaticRoutes projects={projects} blogPosts={blogPosts} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
