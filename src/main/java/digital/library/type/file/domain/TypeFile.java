package digital.library.type.file.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import digital.library.book.domain.Book;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Iwan on 10.03.2016.
 */
@Entity
@Table(name = "typeFiles")
public class TypeFile implements Serializable{

    @Id
    @Column(name = "id")
    @GeneratedValue
    private Long id;

    @Size(min = 5, max = 50)
    @Column(name = "typeName")
    private String typeName;

    @Size(min = 5, max = 250)
    @Column(name = "nameProgramForOpenBook")
    private String nameProgramForOpenBook;

    @Column(name = "webSiteForDownload")
    private String webSiteForDownload;

    @JsonIgnore
    @ManyToMany(targetEntity = Book.class)
    private Set<Book> books = new HashSet<>();

    public TypeFile() {

    }

    public TypeFile(String typeName, String nameProgramForOpenBook, String webSiteForDownload) {
        this.typeName = typeName;
        this.nameProgramForOpenBook = nameProgramForOpenBook;
        this.webSiteForDownload = webSiteForDownload;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public String getNameProgramForOpenBook() {
        return nameProgramForOpenBook;
    }

    public void setNameProgramForOpenBook(String nameProgramForOpenBook) {
        this.nameProgramForOpenBook = nameProgramForOpenBook;
    }

    public String getWebSiteForDownload() {
        return webSiteForDownload;
    }

    public void setWebSiteForDownload(String webSiteForDownload) {
        this.webSiteForDownload = webSiteForDownload;
    }

    public Set<Book> getBooks() {
        return books;
    }

    public void setBooks(Set<Book> books) {
        this.books = books;
    }
}
