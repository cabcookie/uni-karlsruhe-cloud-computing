# Kurs Cloud Computing an der Uni Karlsruhe

Am 10. April 2021 habe ich einen Workshop an der Universität Karlsruhe gehalten für den Fachbereich Informatik. Der Kurs ist verantwortet von Michael Siebers. In dem Kurs erstellen die Studenten Ressourcen in AWS, um eine Suchseite für Filme zu erstellen. Sie lernen das Indizieren und das Durchsuchen des Index mittels ElasticSearch.

Der Fokus für mich ist dabei, den Studenten zu vermitteln, was Cloud Computing bedeutet und wie man eine Website in der Cloud erstellt.

## Was ist Cloud Computing?



## Das Erstellen einer Webseite mittels der AWS Console

Wenn wir einen AWS Account das erste mal erstellen, ist dies der sogenannte Root Account. Es ist ratsam, diesen besonders zu schützen, da wir an diesem Account unsere Kreditkarte hinterlegt haben und sollte ein Nutzer in diesen Account einbrechen, kann großer finanzieller Schaden entstehen. Den Root Account schützen wir durch ...

1. ... Anlegen einer Multifaktor-Authentifizierung (MFA)
2. ... Erstellen eines IAM Users Admin, den wir fortan verwenden

Den Root Account selbst verwenden wir niemals um weitere Ressourcen zu erstellen oder zu verwalten.

**Erstellen eines IAM Users**

Wir erstellen nun einen IAM User mit vollen Administrationsrechten in unserer Umgebung. IAM steht für Identity and Access Management. Identitäten sind User, Rollen und Gruppen und Access steht für die Rechte, die ich diesen Identitäten einräume. Rechte werden über sogenannte Policies eingeräumt. Dabei gibt es von AWS verwaltete Policies, die man einfach übernehmen kann oder Policies, die wir als Nutzer von AWS selbst verwalten.

Wir versuchen jedem Nutzer nur die notwendigsten Rechte einzuräumen, um sicher zu stellen, dass unsere Umgebung ausreichend geschützt ist. Dieses Prinzip nennt man „Least Privilege“.

Wir erstellen nun diesen Admin User mit Zugriff auf die AWS Management Console und erstellen ein möglichst sicheres Passwort.

Wir weisen dem User die `AdministratorAccess` Policy zu, so dass dieser neue User auf allen AWS Ressourcen alle Operationen ausführen kann.

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

Da auch dieser Anwender sehr schützenswert ist, sollte hier ebenfalls ein MFA eingerichtet werden.




## Das Erstellen einer Webseite mittels der AWS CLI

Um die AWS CLI nutzen zu können, benötige ich einen User, für den der programmatische Zugriff erteilt wurde. Wir erstellen dafür für den bereits existierenden IAM User Access Keys. Im Terminal richte ich nun diesen Nutzer mittels `aws configure` ein.

Wir clonen in diesem Beispiel eine Umgebung aus den CDK Beispielen:

```bash
git clone https://github.com/aws-samples/aws-cdk-examples/
```

Wir nutzen den Code aus dem Ordner `typescript/application-load-balancer` und kopieren die Datein in unser Arbeitsverzeichnis. Nun installieren wir das AWS Cloud Development Kit und die benötigten Pakete:

```bash
npm install -g aws-cdk
npm install
```



### Arbeiten mit der AWS CDK

The `cdk.json` file tells the CDK Toolkit how to execute your app.

**Some Useful commands**

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
