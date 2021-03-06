import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
    addCategory, 
    getAllCategory, 
    updateCategories,
    deleteCategories as deleteCategoriesAction 
} from '../../redux/actions';
import CheckboxTree from 'react-checkbox-tree';
import {
    IoIosCheckboxOutline,
    IoIosCheckbox,
    IoIosArrowForward,
    IoIosArrowDown,
    IoIosPaper,
    IoIosFolder,
    IoIosFolderOpen,
    IoIosAdd,
    IoIosCreate,
    IoIosTrash
} from 'react-icons/io';

import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import UpdateCategoriesModal from './components/UpdateCategoriesModal';
import AddCategoryModal from './components/AddCategoryModal';
import DeleteCategoryModal from './components/DeleteCategoriesModal';
import './style.css';

const Category = (props) => {
    const category = useSelector(state => state.category);
    const [categoryName, setCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [categoryImage, setCategoryImage] = useState('');
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [checkedArray, setCheckedArray] = useState([]);
    const [expandedArray, setExpandedArray] = useState([]);
    const [addCategoryModal, setAddCategoryModal] = useState(false);
    const [updateCategoryModal, setUpdateCategoryModal] = useState(false);
    const [deleteCategoryModal, setDeleteCategoryModal] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if(!category.loading){
            setAddCategoryModal(false);
            setUpdateCategoryModal(false);
        }
    }, [category.loading]);

    const handleSaveAddCategory = () => {
        
        const form = new FormData();

        if(categoryName === ""){
            alert("Category name is required");
            setAddCategoryModal(false);
            return;
        }

        form.append('name', categoryName);
        form.append('parentId', parentCategoryId);
        form.append('categoryImage', categoryImage);

        dispatch(addCategory(form));
        setCategoryName('');
        setParentCategoryId('');
        setAddCategoryModal(false);
    };
    const handleShow = () => setAddCategoryModal(true);

    const renderCategories = (categories) => {
        let _categories = [];
        for(let category of categories){
            _categories.push(
                {
                    label: category.name,
                    value: category._id,
                    children: category.children.length > 0 && renderCategories(category.children)
                }
            );
        }
        return _categories;
    }

    const createCategoryList = (categories, options = []) => {
        for(let category of categories){
            options.push({
                value: category._id, 
                name: category.name, 
                parentId: category.parentId, 
                type: category.type
            });
            if(category.children.length > 0){
                createCategoryList(category.children, options)
            }
        }

        return options;
    }

    const handleCategoryImage = (e) => {
        setCategoryImage(e.target.files[0]);
    }

    const updateCategory = () => {
        updateCheckedAndExpandedCategories();
        setUpdateCategoryModal(true);
    }

    const handleCloseAddModal = () => {
        setAddCategoryModal(false);
        setCategoryName('');
        setParentCategoryId('');
        setCategoryImage('');
    }

    const handleCloseUpdateModal = () => {
        setUpdateCategoryModal(false);
    }
    const handleCloseDeleteModal = () => {
        setDeleteCategoryModal(false);
    }

    const updateCheckedAndExpandedCategories = () => {
        const categories = createCategoryList(category.categories);
        const checkedArray = [];
        const expandedArray = [];
        checked.length > 0 && checked.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId === category.value);
            category && checkedArray.push(category);
        });
        expanded.length > 0 && expanded.forEach((categoryId, index) => {
            const category = categories.find((category, _index) => categoryId === category.value);
            category && expandedArray.push(category);
        });
        setCheckedArray(checkedArray);
        setExpandedArray(expandedArray);
    }
    
    const handleCategoryInput = (key, value, index, type) => {
        if(type === 'checked'){
            const updatedCheckedArray = checkedArray.map((item, _index) => 
                index === _index ? { ...item, [key]: value } : item );
            setCheckedArray(updatedCheckedArray);
        }else if(type === 'expanded'){
            const updatedExpandedArray = expandedArray.map((item, _index) => 
                index === _index ? { ...item, [key]: value } : item );
            setExpandedArray(updatedExpandedArray);
        }
    }

    const updateCategoriesForm = () => {
        const form = new FormData();

        expandedArray.forEach((item, index) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        checkedArray.forEach((item, index) => {
            form.append('_id', item.value);
            form.append('name', item.name);
            form.append('parentId', item.parentId ? item.parentId : "");
            form.append('type', item.type);
        });
        dispatch(updateCategories(form))
    } 


    const deleteCategory = () => {
        updateCheckedAndExpandedCategories();
        setDeleteCategoryModal(true);
    }

    const deleteCategories = () => {
        const checkedIdsArray = checkedArray.map((item, index) => ({_id: item.value}));
        const expandedIdsArray = expandedArray.map((item, index) => ({_id: item.value}));
        const idsArray = expandedIdsArray.concat(checkedIdsArray);

        if(checkedIdsArray.length > 0){
            dispatch(deleteCategoriesAction(checkedIdsArray))
            .then(result => {
                if(result){
                    dispatch(getAllCategory());
                    setDeleteCategoryModal(false);
                }
            });
        }

        setDeleteCategoryModal(false);
    }

    const categoryList = createCategoryList(category.categories);
    return (
        <Layout sidebar>
            <Container>
                <Row>
                    <Col md={12}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>Category</h3>
                            <div className="actionBtnContainer">
                                <span>Action: </span>
                                <button onClick={handleShow}><IoIosAdd /> <span>Add</span></button>
                                <button onClick={updateCategory}><IoIosCreate /> <span>Edit</span></button>
                                <button onClick={deleteCategory}><IoIosTrash /> <span>Delete</span></button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <CheckboxTree
                            nodes={renderCategories(category.categories)}
                            checked={checked}
                            expanded={expanded}
                            onCheck={checked => setChecked(checked)}
                            onExpand={expanded => setExpanded(expanded)}
                            icons={{
                                check: <IoIosCheckbox />,
                                uncheck: <IoIosCheckboxOutline />,
                                halfCheck: <IoIosCheckboxOutline />,
                                expandClose: <IoIosArrowForward />,
                                expandOpen: <IoIosArrowDown />,
                                leaf: <IoIosPaper />,
                                parentClose: <IoIosFolder />,
                                parentOpen: <IoIosFolderOpen />
                            }}
                        />
                    </Col>
                </Row>
            </Container>
            <AddCategoryModal
                show={addCategoryModal}
                handleClose={handleCloseAddModal}
                handleSave={handleSaveAddCategory}
                modalTitle={'Add New Category'}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                parentCategoryId={parentCategoryId}
                setParentCategoryId={setParentCategoryId}
                categoryList={categoryList}
                handleCategoryImage={handleCategoryImage}
            />
            <UpdateCategoriesModal
                show={updateCategoryModal}
                handleClose={handleCloseUpdateModal}
                handleSave={updateCategoriesForm}
                modalTitle={'Update Category'}
                size="lg"
                expandedArray={expandedArray}
                checkedArray={checkedArray}
                handleCategoryInput={handleCategoryInput}
                categoryList={categoryList}
            />
            <DeleteCategoryModal
                show={deleteCategoryModal}
                handleClose={handleCloseDeleteModal}
                modalTitle={'Confirm'}
                expandedArray={expandedArray}
                checkedArray={checkedArray}
                deleteCategories={deleteCategories}
            />
        </Layout>
    )
}

export default Category
