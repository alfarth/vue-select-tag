<?php

use Admin\Controller\GerenciarAssuntosController;
use Admin\Controller\GerenciarDificuldadesController;
use Laminas\Router\Http\Literal;
use Laminas\Router\Http\Segment;

return [
    'type' => Segment::class,

    'options' => [
        'route' => '/admin/componentes',
    ],

    'may_terminate' => true,

    'child_routes' => [

        'dificuldades' => [
            'type' => Literal::class,
            'options' => [
                'route' => '/dificuldades',
                'defaults' => [
                    'controller' => GerenciarDificuldadesController::class,
                    'action' => 'get-dificuldades-componente'
                ],
            ],
        ],
        'dificuldades_inserir' => [
            'type' => Literal::class,
            'options' => [
                'route' => '/dificuldades/inserir',
                'defaults' => [
                    'controller' => GerenciarDificuldadesController::class,
                    'action' => 'set-dificuldades-componente'
                ],
            ],
        ],
        'dificuldades_remover' => [
            'type' => Literal::class,
            'options' => [
                'route' => '/dificuldades/remover',
                'defaults' => [
                    'controller' => GerenciarDificuldadesController::class,
                    'action' => 'remover-dificuldades-componente'
                ],
            ],
        ],

        'assuntos' => [
            'type' => Literal::class,
            'options' => [
                'route' => '/assuntos',
                'defaults' => [
                    'controller' => GerenciarAssuntosController::class,
                    'action' => 'get-assuntos-componente'
                ],
            ],
        ],
        'assuntos_inserir' => [
            'type' => Literal::class,
            'options' => [
                'route' => '/assuntos/inserir',
                'defaults' => [
                    'controller' => GerenciarAssuntosController::class,
                    'action' => 'set-assuntos-componente'
                ],
            ],
        ],
        'assuntos_remover' => [
            'type' => Literal::class,
            'options' => [
                'route' => '/assuntos/remover',
                'defaults' => [
                    'controller' => GerenciarAssuntosController::class,
                    'action' => 'remover-assuntos-componente'
                ],
            ],
        ],

    ],
];
