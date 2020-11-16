
#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <fcntl.h>
#include <string.h> 
#include <sys/socket.h>
#include <netinet/in.h> 
#include <netdb.h> 
#include <arpa/inet.h>


void displayHelp(){
    printf("Usage:\n --url: specify url to request\n --help to display this message\n");
    exit(0);
    return;
}

char* getURL(char* argv[], int index)
{
    //printf("%s\n", argv[index + 1]);
    return argv[index + 1];
}

void displayURLUsageError()
{
    printf("No URL specified, please enter a URL after the --url argument\n");
    exit(1);
    return;
}

int main (int argc, char* argv[]){
    int i;
    char *url = "";
    if (argc == 1)
        displayHelp();
    //handle arguments
    for (i = 1; i < argc; i+=2)
    {
        char *val;
        val = argv[i];
        if (strcmp(val, "--help") == 0)
            displayHelp();
        else if (strcmp(val, "--url") == 0)
        {
            //if this is the last argument, display error
            if (i == (argc - 1))
                displayURLUsageError();
            else
                url = getURL(argv, i);
        }
        else
            displayHelp();
    }
    
    //declare vars
    char response [4096];
    char req [1000];
    struct hostent *host;
    struct sockaddr_in addr;


    //init socket
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    bzero(&host, sizeof(host));
    //memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_port = htons(80);
    if (sockfd < 0) error("Socket Error\n");

    //separate URL
    char *path = strchr(url, '/');
    char* domain = calloc(path - url + 1, sizeof(char));
    strncpy(domain, url, path - url);
    host = gethostbyname(domain);
    //assign socket host
    char* temp = inet_ntoa(*(struct in_addr *)host->h_name);
    //exit(1);
    addr.sin_addr.s_addr = inet_addr(temp);


    char message [] = "";
    
    sprintf(req, 
            "POST %s HTTP/1.1\r\n"
            "Host: %s\r\n"
            "\r\n",
            path, domain); 
       
    //char *header = "GET /links HTTP/1.1\r\nHost: gse-chllnge.clburdsall.workers.dev\r\n\r\n";
    //printf("%s\n", req);

    if (connect(sockfd, (struct sockaddr*)&addr, sizeof(struct sockaddr)) < 0)
        error("socket error\n");
    printf("connection established\n");
    //send request to host

    send(sockfd, &req, strlen(req), 0);
    printf("Request sent:\n%s\n", req);

    int bytes = recv(sockfd, &response, sizeof(response) - 1, 0);
    response[bytes] = 0;
    if (bytes < 0) error("Read error");
    printf("Response recieved\n");
    printf("%s", response);

    return 0;
}