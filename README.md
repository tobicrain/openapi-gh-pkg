OpenAPI for GitHub Packages
===========================

OpenAPI for GitHub Packages is a tool that generates and publishes libraries based on open API specification files to GitHub packages. With OpenAPI for GitHub Packages, developers can easily create and distribute their own APIs or utilize existing APIs in their projects. The generated libraries are compatible with a wide range of programming languages and can be easily installed and used in other projects through GitHub's package management system. OpenAPI for GitHub Packages streamlines the process of API development and distribution, making it easier for developers to create and use APIs in their projects.

Getting Started
---------------

To use OpenAPI for GitHub Packages, you will need to provide the path to your open API specification file and a GitHub deploy token. You can specify the default input values in the `action.yml` file, as shown below:

```yml
steps:
  - uses: actions/checkout@v2
  - name: OpenAPI Generator
    uses: tandamo/openapi-gh-pkg@main
    with:
      SCHEMA_FILE_PATH: api.yaml
      DEPLOY_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

You can also specify deployment options in your open API specification file using the `x-deploy` extension. For example:


```yml
x-deploy:
  spring:
    artifact: service-server
    group: com.company
  kotlin:
    artifact: service-client
    group: com.company
  typescript-angular:
    name: service
```

With these inputs, OpenAPI for GitHub Packages will generate and publish libraries for the specified programming languages and frameworks to GitHub packages.

Additional Resources
--------------------

*   [OpenAPI specification](https://www.openapis.org/)
*   [GitHub Packages](https://docs.github.com/en/packages)
