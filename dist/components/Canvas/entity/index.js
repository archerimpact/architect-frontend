"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require("react-redux");

var _reactRouterDom = require("react-router-dom");

var _entityCard = require("../entityCard");

var _entityCard2 = _interopRequireDefault(_entityCard);

require("./style.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pageHeight = window.innerHeight;

var Entity = function (_Component) {
    _inherits(Entity, _Component);

    function Entity() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Entity);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Entity.__proto__ || Object.getPrototypeOf(Entity)).call.apply(_ref, [this].concat(args))), _this), _this.renderEntity = function (node, nodes, links, keys) {
            var nodeMap = {};
            if (node === null || node === undefined) {
                return null;
            }
            nodes.forEach(function (n) {
                return nodeMap[n.id] = n.name;
            });

            var extract_link = function extract_link(type, compareSource, compareTarget) {
                if (compareSource) {
                    return links.filter(function (link) {
                        return link.type === type && node.id === link.source;
                    }).map(function (link) {
                        for (var k = 0; k < nodes.length; k++) {
                            if (nodes[k].id === link.target) {
                                return nodes[k];
                            }
                        }
                    });
                } else if (compareTarget) {
                    return links.filter(function (link) {
                        return link.type === type && node.id === link.target;
                    }).map(function (link) {
                        for (var k = 0; k < nodes.length; k++) {
                            if (nodes[k].id === link.source) {
                                return nodes[k];
                            }
                        }
                    });
                }
            };

            var aliases = extract_link('AKA', true, false);
            var documents = extract_link('HAS_ID_DOC', true, false);
            var locations = extract_link('HAS_KNOWN_LOCATION', true, false);
            var sanctions = extract_link('SANCTIONED_ON', true, false);

            var part_ofs = extract_link('SIGNIFICANT_PART_OF', true, false);
            var contains = extract_link('SIGNIFICANT_PART_OF', false, true);

            var supporting = extract_link('PROVIDING_SUPPORT_TO', true, false);
            var supported = extract_link('PROVIDING_SUPPORT_TO', false, true);

            var owned = extract_link('OWNED_BY', true, false);
            var owns = extract_link('OWNED_BY', false, true);

            var subservants = extract_link('LEADER_OF', true, false);
            var leaders = extract_link('LEADER_OF', false, true);

            var acting = extract_link('ACTING_FOR', true, false);
            var action_received = extract_link('ACTING_FOR', false, true);

            var associates = extract_link('ASSOCIATE_OF', false, true);
            var related = extract_link('RELATED_TO', false, true);

            var maybe_sames = links.filter(function (link) {
                return link.type === link.type.startsWith('MATCHED_') && node.id === link.source;
            });

            var linktypes = {
                'Documents': {
                    type: 'HAS_ID_DOC',
                    extracted: documents,
                    chooseDisplay: 'target'
                },
                'Locations': {
                    type: 'HAS_KNOWN_LOCATION',
                    extracted: locations,
                    chooseDisplay: 'target'
                },
                'Sanctioned On': {
                    type: 'SANCTIONED_ON',
                    extracted: sanctions,
                    chooseDisplay: 'target'
                },
                'Significant Part Of': {
                    type: 'SIGNIFICANT_PART_OF',
                    extracted: part_ofs,
                    chooseDisplay: 'target'
                },
                'Significantly Contains': {
                    type: 'SIGNIFICANT_PART_OF',
                    extracted: contains,
                    chooseDisplay: 'source'
                },
                'Providing Support To': {
                    type: 'PROVIDING_SUPPORT_TO',
                    extracted: supporting,
                    chooseDisplay: 'target'
                },
                'Supported By': {
                    type: 'PROVIDING_SUPPORT_TO',
                    extracted: supported,
                    chooseDisplay: 'source'
                },
                'Owned By': {
                    type: 'OWNED_BY',
                    extracted: owned,
                    chooseDisplay: 'target'
                },
                'Owns': {
                    type: 'OWNED_BY',
                    extracted: owns,
                    chooseDisplay: 'source'
                },
                'Leader Of': {
                    type: 'LEADER_OF',
                    extracted: subservants,
                    chooseDisplay: 'target'
                },
                'Lead By': {
                    type: 'LEADER_OF',
                    extracted: leaders,
                    chooseDisplay: 'source'
                },
                'Acting For': {
                    type: 'ACTING_FOR',
                    extracted: acting,
                    chooseDisplay: 'target'
                },
                'Receives Actions From': {
                    type: 'ACTING_FOR',
                    extracted: action_received,
                    chooseDisplay: 'source'
                },
                'Associate Of': {
                    type: 'ASSOCIATE_OF',
                    extracted: associates,
                    chooseDisplay: 'source'
                },
                'Related To': {
                    type: 'RELATED_TO',
                    extracted: related,
                    chooseDisplay: 'source'
                },
                'Aliases': {
                    type: 'AKA',
                    extracted: aliases,
                    chooseDisplay: 'target'
                },
                'Possibly Same As': {
                    type: '',
                    extracted: maybe_sames,
                    chooseDisplay: 'target'
                }
            };

            var empty = true;
            var attrs = _react2.default.createElement(
                "div",
                null,
                keys.filter(function (k) {
                    return node[k[0]];
                }).map(function (k) {
                    var n = node;
                    var val = n[k[0]];
                    empty = false;
                    return _react2.default.createElement(
                        "div",
                        { className: "info-row", key: k },
                        _react2.default.createElement(
                            "p",
                            { className: "info-key" },
                            k[1]
                        ),
                        !(val instanceof Array) ? _react2.default.createElement(
                            "p",
                            { className: "info-value" },
                            val.toString()
                        ) : val.map(function (v) {
                            return _react2.default.createElement(
                                "li",
                                { className: "info-value", key: v },
                                v
                            );
                        })
                    );
                })
            );

            return _react2.default.createElement(
                "div",
                { className: "full-width" },
                _react2.default.createElement(
                    "div",
                    { className: "entity-header-wrapper" },
                    _react2.default.createElement(
                        "div",
                        { className: "entity-header" },
                        _react2.default.createElement(
                            "div",
                            { className: "entity-name" },
                            node.name || node.combined || node.label || node.description
                        ),
                        _react2.default.createElement(
                            "div",
                            { className: "entity-type" },
                            node.type
                        )
                    )
                ),
                _react2.default.createElement("hr", null),
                _react2.default.createElement(
                    "div",
                    { className: "entity-body" },
                    empty ? null : _react2.default.createElement(
                        "div",
                        null,
                        _react2.default.createElement(
                            "h5",
                            { className: "subheader" },
                            "Attributes"
                        ),
                        attrs
                    ),
                    _react2.default.createElement(
                        "div",
                        null,
                        Object.keys(linktypes).filter(function (l) {
                            return linktypes[l].extracted.length !== 0;
                        }).map(function (l, idx) {
                            var t = linktypes[l];
                            return _react2.default.createElement(
                                "div",
                                { key: idx },
                                _react2.default.createElement(
                                    "h5",
                                    { className: "subheader", key: "h5-" + idx },
                                    l
                                ),
                                t.extracted.map(function (node) {
                                    return _react2.default.createElement(_entityCard2.default, { key: node.id, node: node, id: node.id, shouldFetch: true, graph: _this.props.graph });
                                })
                            );
                        })
                    )
                )
            );
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    // componentDidMount() {
    //     if (this.props.id) {
    //         this.props.dispatch(fetchCurrentEntity(this.props.id))
    //     }
    // }
    //
    // componentWillReceiveProps(nextprops) {
    //     if (this.props.id) {
    //         server.getNode(decodeURIComponent(this.props.id), 1, false)
    //             .then(d => {
    //                 this.setState({currentEntityDegreeOne: d})
    //             })
    //             .catch(err => console.log(err));
    //     }
    // }


    _createClass(Entity, [{
        key: "render",
        value: function render() {
            var currentEntity = this.props.currentEntity;

            var keys = [['dateOfBirth', 'Date of Birth'], ['placeOfBirth', 'Place of Birth'], ['titles', 'Titles'], ['emailAddresses', 'Email Addresses'], ['websites', 'Websites'], ['aliases', 'Aliases'], ['programs', 'Programs'], ['numberType', 'Document Type'], ['valid', 'Valid'], ['number', 'Number'], ['issuedBy', 'Issuer'], ['issuedIn', 'Place of Issue'], ['issuedOn', 'Date of Issue'], ['notes', 'Notes']];
            if (currentEntity === null) {
                return _react2.default.createElement(
                    "div",
                    { className: "sidebar-content-container placeholder-text", style: { paddingTop: pageHeight / 3 } },
                    " Click a node to view information about it "
                );
            }
            if (currentEntity === false) {
                return null;
            }
            var id = currentEntity.id;
            return _react2.default.createElement(
                "div",
                { className: "sidebar-content-container" },
                this.renderEntity(currentEntity.nodes.filter(function (n) {
                    return n.id === id;
                })[0], currentEntity.nodes, currentEntity.links, keys)
            );
        }
    }]);

    return Entity;
}(_react.Component);

function mapDispatchToProps(dispatch) {
    return {
        dispatch: dispatch
    };
}

function mapStateToProps(state) {
    return {
        currentEntity: state.graphSidebar.currentEntity
        // should add currentNode here... but let me first see if that's first actually being used.
        // if not being used, then should only track when sidebar is visible. If it is being used, then always track regardless
    };
}

exports.default = (0, _reactRouterDom.withRouter)((0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Entity));