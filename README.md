# Reactivity

An event management system developed using .NET Core 3.0, React, MobX and Semantic UI. Core functionality includes user management and CRUD for event management.

### Prerequisites

- .NET Core 3.0 above
- Node (npm)
- JWT User secret configured

### Configuring JWT secret key

The following steps MUST be performed before starting the .NET project. The user secret key will be added to the API project

Specifiying the JWT user secret key

```
dotnet user-secrets init -p API/
```

The above command will add the user secret key to the API project in the API.csproj file as shown below (an example only)

```
<UserSecretsId>56d24f73-a25a-4bdd-99b5-c6481622ba3b</UserSecretsId>
```

Adding the user secret key to the project

```
dotnet user-secrets set "TokenKey" "super secret key" -p API/
```

To make sure this key has been added, we can use the following command

```
dotnet  user-secrets list -p API/
```

Once we do that, the key will be saved to a location in the machine NOT the source code. Hence, if we clone this project, these steps MUST be repeated in order to run the project successfully.

### Installing npm packages

```
cd  client-app
npm install
```

### Starting .NET project

```
cd API/
dotnet watch run
```

### Starting the React App

```
cd client-app/
npm run
```
