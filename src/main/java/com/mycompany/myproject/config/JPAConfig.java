package com.mycompany.myproject.config;

import java.sql.SQLException;

import javax.sql.DataSource;

//import org.apache.commons.dbcp.BasicDataSource;
import org.dozer.DozerBeanMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.*;
import org.springframework.core.env.Environment;
import org.springframework.dao.annotation.PersistenceExceptionTranslationPostProcessor;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.*;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import oracle.ucp.jdbc.PoolDataSource;
import oracle.ucp.jdbc.PoolDataSourceFactory;

@Configuration
@EnableTransactionManagement
@ComponentScan("com.mycompany.myproject.persist")
@EnableJpaRepositories("com.mycompany.myproject.persist")
@PropertySource({ "classpath:application.properties" })
public class JPAConfig {
	
	@Autowired
	private Environment env;

//    @Bean(name = "dataSource")
//    public DataSource dataSource() {
//        /*return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.HSQL).setName("myDb")
//                .addScript("classpath:schema.sql").addScript("classpath:data.sql").build();*/
//    	BasicDataSource dataSource = new BasicDataSource();
//		dataSource.setDriverClassName(env.getProperty("jdbc.driverClassName"));
//		dataSource.setUrl(env.getProperty("spring.datasource.url"));
//		dataSource.setUsername(env.getProperty("spring.datasource.username"));
//		dataSource.setPassword(env.getProperty("spring.datasource.password"));
//		return dataSource;
//    }
	
	@Bean(name = "dataSource")
	public DataSource dataSource() throws SQLException{
		int initpoolsize = Integer.parseInt(env.getProperty("ucp.jdbc.InitialLimit"));
		int minpoolsize = Integer.parseInt(env.getProperty("ucp.jdbc.MinLimit"));
		int maxpoolsize = Integer.parseInt(env.getProperty("ucp.jdbc.MaxLimit"));
		int inactivetimeout = Integer.parseInt(env.getProperty("ucp.jdbc.InactivityTimeout"));
		int abandonedtimeout = Integer.parseInt(env.getProperty("ucp.jdbc.AbandonedConnectionTimeout"));
		int maxconnreusecount = Integer.parseInt(env.getProperty("ucp.jdbc.MaxConnectionReuseCount"));
		
		/*return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.HSQL).setName("myDb")
				.addScript("classpath:schema.sql").addScript("classpath:data.sql").build();*/
	//  BasicDataSource dataSource = new BasicDataSource();
		PoolDataSource dataSource = PoolDataSourceFactory.getPoolDataSource();
	//  dataSource.setDriverClassName(env.getProperty("jdbc.driverClassName"));
		dataSource.setURL(env.getProperty("spring.datasource.url"));
		dataSource.setConnectionFactoryClassName("oracle.jdbc.pool.OracleDataSource");
		dataSource.setUser(env.getProperty("spring.datasource.username"));
		dataSource.setPassword(env.getProperty("spring.datasource.password"));
		dataSource.setInitialPoolSize(initpoolsize);
		dataSource.setMinPoolSize(minpoolsize);
		dataSource.setMaxPoolSize(maxpoolsize);
		dataSource.setInactiveConnectionTimeout(inactivetimeout);
		dataSource.setAbandonedConnectionTimeout(abandonedtimeout);
		return dataSource;
	}

    @Bean(name = "entityManagerFactory")
    public LocalContainerEntityManagerFactoryBean entityManagerFactoryBean() throws SQLException {
        LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
        factoryBean.setDataSource(dataSource());
        factoryBean.setPackagesToScan("com.mycompany.myproject.persist");
        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
        vendorAdapter.setShowSql(true);
        factoryBean.setJpaVendorAdapter(vendorAdapter);
        return factoryBean;
    }

    @Bean
    public PlatformTransactionManager transactionManager() throws SQLException{
        JpaTransactionManager transactionManager = new JpaTransactionManager();
        transactionManager.setEntityManagerFactory(entityManagerFactoryBean().getObject());
        return transactionManager;
    }

    @Bean
    public PersistenceExceptionTranslationPostProcessor exceptionTranslation() {
        return new PersistenceExceptionTranslationPostProcessor();
    }

    @Bean
    public DozerBeanMapper getMapper() {
        return new DozerBeanMapper();
    }

}
