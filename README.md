

#  notes and todo
Add New and delete works.
Dropdown sorts distinct  names.

To-do:
1. beautification

--deprecated--
## MySQL Server 
CREATE DATABASE notetaking;
CREATE  TABLE articles (ID INT NOT NULL AUTO_INCREMENT, SubjectName VARCHAR(20) NOT NULL, Topic VARCHAR(20) NOT NULL, Description TEXT, CreationDate DATETIME, PRIMARY KEY(ID, Topic));
