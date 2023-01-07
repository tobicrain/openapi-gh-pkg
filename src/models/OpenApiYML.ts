export interface OpenApiYML {
    "x-deploy": Deployment;
    info: {
        version: string;
    };
}

export type DeploymentName = "kotlin" | "spring" | "typescript-angular" | "java";

export type Deployment = {
    [key in DeploymentName]: JARDeployment | NPMDeployment;
};

export interface JARDeployment {
    artifact: string;
    group: string;
}

export interface NPMDeployment {
    name: string;
}